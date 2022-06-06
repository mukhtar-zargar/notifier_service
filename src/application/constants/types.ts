const TYPES = {
  App: Symbol.for("App"),
  Logger: Symbol.for("Logger"),
  EventQueue: Symbol("EventsQueue"),
  CacheRepository: Symbol("CacheRepository"),
  MessagingProducer: Symbol("MessagingProducer"),
  UserRepository: Symbol("UserRepository")
};

export { TYPES };
