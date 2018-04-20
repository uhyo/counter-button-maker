// Just a trick to use express in es2015 module.
// /// <reference types="express-serve-static-core" />

import * as express from 'express';
import * as core from 'express-serve-static-core';

export const e = (express as any) as typeof express & (() => core.Express);

export default e;
