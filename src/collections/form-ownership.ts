import { CollectionConfig } from 'payload';

export const FormOwnership: CollectionConfig = {
  slug: 'form-ownership',
  admin: {
    useAsTitle: 'form',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') {
        return true;
      }

      if (req.user) {
        return {
          user: {
            equals: req.user.id,
          },
        };
      }

      return false;
    },
    create: ({ req }) => !!req.user,
    update: () => false,
    delete: ({ req }) => req.user?.role === 'admin' || false,
  },
  fields: [
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms', // This should match the slug of your form collection created by the plugin
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
};
