import { Container } from "inversify";

import { Logger } from "./infra/logging/pino";
import { TYPES } from "./application/constants/types";

const container = new Container();

container.bind(TYPES.Logger).to(Logger).inSingletonScope();

export { container };
