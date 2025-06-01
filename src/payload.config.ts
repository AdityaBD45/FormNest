// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { FormOwnership } from './collections/form-ownership'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, FormOwnership],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    formBuilderPlugin({
      formOverrides: {
        hooks: {
          afterChange: [
            async ({ doc, req, operation }) => {
              if (!doc || !req?.user || (operation !== 'create' && operation !== 'update')) return

              const existing = await req.payload.find({
                collection: 'form-ownership',
                where: {
                  form: {
                    equals: doc.id,
                  },
                  user: {
                    equals: req.user.id,
                  },
                },
                limit: 1,
                req,
              })

              if (existing.totalDocs === 0) {
                await req.payload.create({
                  collection: 'form-ownership',
                  data: {
                    form: doc.id,
                    user: req.user.id,
                  },
                  req,
                })
              }
            },
          ],
        },
        access: {
          read: async ({ req }) => {
            if (req.user?.role === 'admin') return true

            if (req.user) {
              try {
                const ownership = await req.payload.find({
                  collection: 'form-ownership',
                  where: {
                    user: {
                      equals: req.user.id,
                    },
                  },
                  req,
                })

                const formIds = ownership.docs
                  .map((doc) => {
                    if (typeof doc.form === 'object' && doc.form?.id) {
                      return doc.form.id
                    }
                    return doc.form
                  })
                  .filter(Boolean)

                return {
                  id: {
                    in: formIds,
                  },
                }
              } catch (err) {
                console.error('Form access error:', err)
                return false
              }
            }

            return false
          },
        },
      },
      formSubmissionOverrides: {
        access: {
          read: async ({ req }) => {
            if (req.user?.role === 'admin') return true

            if (req.user) {
              try {
                const ownership = await req.payload.find({
                  collection: 'form-ownership',
                  where: {
                    user: {
                      equals: req.user.id,
                    },
                  },
                  req,
                })

                const formIds = ownership.docs
                  .map((doc) => {
                    if (typeof doc.form === 'object' && doc.form?.id) {
                      return doc.form.id
                    }
                    return doc.form
                  })
                  .filter(Boolean)

                return {
                  form: {
                    in: formIds,
                  },
                }
              } catch (err) {
                console.error('FormSubmission access error:', err)
                return false
              }
            }

            return false
          },
        },
      },
    }),

    // storage-adapter-placeholder
  ],
})
