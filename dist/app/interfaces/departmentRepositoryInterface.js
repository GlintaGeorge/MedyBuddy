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
exports.departmentDbRepository = void 0;
const departmentDbRepository = (repository) => {
    const addDepartment = (department) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addDepartment(department); });
    const getDepartmentbyName = (deparmentName) => __awaiter(void 0, void 0, void 0, function* () { return repository.getDepartmentbyName(deparmentName); });
    const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllDepartments(); });
    const updateDepartment = (id, department) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateDepartment(id, department); });
    const blockDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.blockDepartment(id); });
    const unblockDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.unblockDepartment(id); });
    const listDepartments = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.listDepartments(); });
    const unlistDepartments = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.unlistDepartments(); });
    return {
        addDepartment,
        getDepartmentbyName,
        getAllDepartments,
        updateDepartment,
        blockDepartment,
        unblockDepartment,
        listDepartments,
        unlistDepartments,
    };
};
exports.departmentDbRepository = departmentDbRepository;
