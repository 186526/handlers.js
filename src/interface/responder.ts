import { request, response } from './index';
export interface responder<RequestCustomType, ResponseCustomType> {
    (
        request: request<RequestCustomType>,
        reponse?: response<ResponseCustomType>,
    ): Promise<response<ResponseCustomType>> | Promise<void> | void;
}
export default responder;
