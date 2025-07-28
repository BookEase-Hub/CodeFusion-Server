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
exports.FileService = void 0;
class FileService {
    listProjectFiles(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to list project files
            return [];
        });
    }
    readFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to read file
            return '';
        });
    }
    newFile() {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to create a new file
        });
    }
    openDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to open file dialog
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to save file
        });
    }
    find(term) {
        return __awaiter(this, void 0, void 0, function* () {
            // Logic to find files
        });
    }
}
exports.FileService = FileService;
