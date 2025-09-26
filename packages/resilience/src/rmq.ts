export type PublishOptions = { routingKey: string; headers?: Record<string,string>; };
export interface MessageBus {
  publish(exchange: string, payload: any, opts?: PublishOptions): Promise<void>;
  subscribe(queue: string, handler: (msg: any, headers: Record<string,string>)=>Promise<void>): Promise<void>;
}
// NOTE: Provide adapters for amqplib/nats/kafka in separate packages; this is the contract.
