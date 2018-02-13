import { ThunkAction } from "../store";
import { Action } from "redux";
import { AnyAction } from "redux";

function requestActionFactory<TRequest, TResponse>(namespace: string, actionName: string) {

    const actions = {
        begin: `${namespace}_${actionName}_BEGIN`,
        success: `${namespace}_${actionName}_SUCCESS`,
        fail: `${namespace}_${actionName}_FAIL`
    }

    //const reducer

    function initiateAction(request: TRequest) {
        return () => (async (dispatch: any, getState: any, extra: any) => {
            dispatch({ type: actions.begin, payload: null });  // Begin

        })
    }

    return initiateAction
}

interface RequestActionConfig<TRequest, TResponse> {
    namespace: string;
    actionName: string;
    dispatchBegin: (request: TRequest) => void;
}


abstract class RequestAction<TRequest, TResponse, TState=any>{
    private actionNames: { begin: string, success: string, fail: string }
    private beginAction: { type: string, payload: null };
    private getFailAction(error: string) {
        return { type: this.actionNames.fail, payload: error }
    }
    constructor(private namespace: string, private actionName: string) {
        // Create our actions
        this.actionNames = {
            begin: `${namespace}_${actionName}_BEGIN`,
            success: `${namespace}_${actionName}_SUCCESS`,
            fail: `${namespace}_${actionName}_FAIL`
        }
        this.beginAction = { type: this.actionNames.begin, payload: null }
    }

    public abstract doWork(request: TRequest): Promise<TResponse>;
    public reduceSuccess(response: TResponse): any {
        const newState = {};
        newState[this.namespace] = {};
        newState[this.namespace][this.actionName]
        return newState;
    }

    public actionCreator: ThunkAction<TRequest> = (request: TRequest) => (async (dispatch, getState, extra) => {
        dispatch(this.beginAction);
        try {
            const response = this.doWork(request);
            dispatch({ type: this.actionNames.success, payload: response });
        } catch (error) {
            dispatch(this.getFailAction(error));
        }
    });

    private reducer(state: TState, action: AnyAction) {
        const newState: TState = Object.assign({}, state);
        switch (action.type) {
            case this.actionNames.begin:
                newState
                break;
            case this.actionNames.fail:

                break;
            case this.actionNames.success:
                this.reduceSuccess(action.payload)
                break;
            default:

                break;
        }
    }
}

interface Something {
    id: number;
    title: string;
}

class GetSomethingList extends RequestAction<{}, Something[], any>{
    constructor(){
        super("SOMETHING","LIST");
    }
    doWork() {
        return Promise.resolve<Something[]>([{ id: 2, title: 'hello' }]);
    }

    reduceSuccess(){

    }
}

const getSomethingList = new GetSomethingList();