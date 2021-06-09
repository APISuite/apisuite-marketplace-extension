export const schema = {
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'Server listen port',
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
      doc: 'Access-Control-Allow-Origin',
      format: Array,
      default: ['http://localhost:6001'],
      env: 'CORS_ALLOW_ORIGIN',
    },
    credentials: {
      doc: 'Access-Control-Allow-Credentials',
      format: Boolean,
      default: true,
      env: 'CORS_ALLOW_CREDENTIALS',
    },
    methods: {
      doc: 'Access-Control-Allow-Methods',
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
    doc: 'Knex.js debug flag',
    format: Boolean,
    default: false,
    env: 'KNEX_DEBUG',
  },
  apisuite: {
    api: {
      doc: 'APISuite API url',
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
