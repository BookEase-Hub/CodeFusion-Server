"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandDispatcher = void 0;
const FileService_1 = require("./FileService");
class CommandDispatcher {
    constructor() {
        this.fileService = new FileService_1.FileService();
        this.commandMap = {
            createNewFile: this.fileService.newFile,
            openFileDialog: this.fileService.openDialog,
            saveFile: this.fileService.save,
            find: this.fileService.find,
            // Add more commands here
        };
    }
    executeCommand(command, context) {
        return __awaiter(this, void 0, void 0, function* () {
            const action = this.commandMap[command];
            if (action) {
                return yield action(context);
            }
            else {
                throw new Error(`Command not found: ${command}`);
            }
        });
    }
}
exports.CommandDispatcher = CommandDispatcher;
