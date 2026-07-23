export class AngularNodeAppEngine {
  handle = () => Promise.resolve(null);
}

export const createNodeRequestHandler = () => {
  return (req: any, res: any, next: any) => {
    if (typeof next === 'function') next();
  };
};

export const writeResponseToNodeResponse = () => {};

export const isMainModule = () => false;
