module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'a1946877cefca6d01666236dba20303c'),
  },
});
