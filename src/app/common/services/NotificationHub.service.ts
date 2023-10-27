import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { NotificationInterface } from '../interfaces/NotificationInterface';
import { MasterRepo } from '../repositories';

@Injectable()
export class SignalRService {
    messageReceived = new EventEmitter<NotificationInterface>();
    connectionEstablished = new EventEmitter<Boolean>();

    private _hubConnection: HubConnection;

    constructor(private _state: MasterRepo) {
        // this.createConnection();
        // this.registerOnServerEvents();
        // this.startConnection();
    }

    sendChatMessage(message: NotificationInterface) {
        this._hubConnection.invoke('SendMessage', message);
    }

    private createConnection() {
        // this._hubConnection = new HubConnectionBuilder()
        //     .withUrl(`http://103.231.42.140/publish/api/chathub?user=${this.GetConnectionId()}`)
        //     .build();
    }

    private GetConnectionId() {
        return "100989";
    }

    private startConnection(): void {
        this._hubConnection
            .start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection, ');
            });
    }

    private registerOnServerEvents(): void {
        this._hubConnection.on('ReceiveMessage', (data: any) => {
            this.messageReceived.emit(data);
        });
    }
}  