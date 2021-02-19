declare function flowFactory (promise: PromiseConstructor): IRunFlow

interface IRunFlow {
  (flows: IFlow, inData: any, callback: ICallback): Promise<any>
}

interface ICallback {
  (item: any, key: string|number, arr: IArrayFlow|IObjectFlow): any
}

type IArrayFlow = Array<any>
type IObjectFlow = object
type IFlow = IArrayFlow | IObjectFlow

export default flowFactory