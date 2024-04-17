import { injectable } from "tsyringe";
import { listClient } from "./methods/listClient";

@injectable()
class ClientController {
    public list = listClient
}

export default ClientController;