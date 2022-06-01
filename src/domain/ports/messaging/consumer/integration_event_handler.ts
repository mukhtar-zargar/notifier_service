import {
  IIntegrationEventHandlerResponse,
  IntegrationEventRecord
} from "../integration_event_record";

export interface IIntegrationEventHandler {
  handle(
    event: IntegrationEventRecord
  ): Promise<IIntegrationEventHandlerResponse>;
}
