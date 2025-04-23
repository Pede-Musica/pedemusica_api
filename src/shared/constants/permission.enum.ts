export enum PERMISSION_TYPE {

    //Home
    CAN_MANAGE_INIT_SYSTEM = 'H1', //Pode desligar e ligar a loja
    CAN_MANAGE_INIT_DELIVERY = 'H2', //Pode desligar e ligar o delivery

    //Pedidos
    CAN_MANAGE_ORDERS = 'O1', //Pode gerenciar pedidos
    CAN_ORDER = 'O2', //Pode anotar pedidos

    //Mesas
    CAN_MANAGE_TABLES = 'T1', //Pode gerenciar mesas

    CAN_MANAGE_REPORT = 'CAN_MANAGE_REPORT',
    CAN_MANAGE_FINANCE = 'CAN_MANAGE_FINANCE',
    

    //Cadastros
    CAN_MANAGE_USERS = 'CAN_MANAGE_USERS',
    CAN_MANAGE_MENU = 'CAN_MANAGE_MENU',
    CAN_MANAGE_SECTORS = 'CAN_MANAGE_SECTORS',
    CAN_MANAGE_SETTINGS = 'CAN_MANAGE_SETTINGS',
}
