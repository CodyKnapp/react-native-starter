import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as JSDOM from 'jsdom';
import { global } from 'core-js';

configure({ adapter: new Adapter() });
require('jest-fetch-mock').enableMocks();

const jsdom = new JSDOM.JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src: any, target: any) {
    Object.defineProperties(target, {
        ...Object.getOwnPropertyDescriptors(src),
        ...Object.getOwnPropertyDescriptors(target),
    });
}

global.window = window;
global.document = window.document;
global.navigator = {
    userAgent: 'node.js',
};
copyProps(window, global);

function _getCallerFile() {
    const originalFunc = Error.prepareStackTrace;
    let callerFile: string = 'unknown';
    try {
        const err = new Error();
        let currentFile: string;
        let stack: NodeJS.CallSite[];
        let stackRecord: NodeJS.CallSite | undefined;

        Error.prepareStackTrace = (error, stackTrace) => {
            return stackTrace;
        };

        stack = <NodeJS.CallSite[]>(<unknown>err.stack);
        stackRecord = <NodeJS.CallSite>stack.shift();
        currentFile = stackRecord.getFileName() || '';

        while (stack.length) {
            stackRecord = <NodeJS.CallSite>stack.shift();
            callerFile = stackRecord.getFileName() || '';
            if (currentFile !== callerFile) {
                break;
            }
        }
    } catch (e) {
    } finally {
        Error.prepareStackTrace = originalFunc;
    }

    return callerFile;
}

function filteredConsole(
    original: (message?: any, ...optionalParams: any[]) => void,
    message?: any,
    ...optionalParams: any[]
) {
    const callerFile = _getCallerFile();
    const blockPattern = /.*(react-dom.development.js|module is not correctly linked)/i;
    if (!blockPattern.test(callerFile) && !blockPattern.test(message)) {
        original(message, ...optionalParams);
    }
}

const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
console.error = (message?: any, ...optionalParams: any[]) =>
    filteredConsole(originalConsoleError, message, ...optionalParams);
console.warn = (message?: any, ...optionalParams: any[]) =>
    filteredConsole(originalConsoleWarn, message, ...optionalParams);