export const schema = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Port the webs server will listen on',
    format: Number,
    default: 6008,
    env: 'API_PORT',
  },
  logLevel: {
    doc: 'Logger verbosity level',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL',
  },
  cors: {
    origin: {
      doc: 'Sets the Access-Control-Allow-Origin header value. This should usually be the portal URL.',
      format: Array,
      default: ['http://localhost:6001'],
      env: 'CORS_ALLOW_ORIGIN',
    },
    credentials: {
      doc: 'Sets the Access-Control-Allow-Credentials header value',
      format: Boolean,
      default: true,
      env: 'CORS_ALLOW_CREDENTIALS',
    },
    methods: {
      doc: 'Sets the Access-Control-Allow-Methods header value',
      format: String,
      default: 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
      env: 'CORS_ALLOW_METHODS',
    },
  },
  dbURI: {
    doc: 'Database connection string',
    format: String,
    default: 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb',
    env: 'DB_URI',
  },
  knexDebug: {
    doc: 'Knex.js debug flag (https://knexjs.org/#Builder-debug)',
    format: Boolean,
    default: false,
    env: 'KNEX_DEBUG',
  },
  apisuite: {
    api: {
      doc: 'APISuite core API url',
      format: String,
      default: 'http://localhost:6001',
      env: 'APISUITE_API_URL',
    },
    introspectEndpoint: {
      doc: 'APISuite introspect endpoint',
      format: String,
      default: '/auth/introspect',
      env: 'INTROSPECT_ENDPOINT',
    },
  },
  msgBroker: {
    url: {
      doc: 'APISuite Message Broker URL',
      format: String,
      default: 'amqp://mquser:mqpwd@localhost:5672',
      env: 'MSG_BROKER_URL',
    },
    eventsExchange: {
      doc: 'APISuite Message Broker Events Exchange name',
      format: String,
      default: 'apisuite_events',
      env: 'RABBITMQ_EVENTS_EXCHANGE',
    },
    queue: {
      doc: 'APISuite Message Broker Events Queue',
      format: String,
      default: 'marketplace-apps',
      env: 'RABBITMQ_QUEUE',
    },
  },
}
