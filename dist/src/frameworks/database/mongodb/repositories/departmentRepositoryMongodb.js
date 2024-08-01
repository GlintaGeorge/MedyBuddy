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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentRepositoryMongodb = void 0;
const department_1 = __importDefault(require("../../models/department"));
const departmentRepositoryMongodb = () => {
    const Departments = () => __awaiter(void 0, void 0, void 0, function* () { return yield department_1.default.find({ isListed: true }); });
    const getDepartmentbyName = (departmentName) => __awaiter(void 0, void 0, void 0, function* () {
        return yield department_1.default.findOne({ departmentName: new RegExp(`^${departmentName}$`, 'i') });
    });
    const addDepartment = (department) => __awaiter(void 0, void 0, void 0, function* () {
        const newDepartment = new department_1.default({
            departmentName: department.getDepartmentName(),
            isListed: department.getIsListed()
        });
        return yield newDepartment.save();
    });
    const getAllDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield department_1.default.find();
    });
    const updateDepartment = (id, departmentName) => __awaiter(void 0, void 0, void 0, function* () {
        yield department_1.default.updateOne({ _id: id }, { $set: departmentName });
    });
    const blockDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield department_1.default.updateOne({ _id: id }, { $set: { isListed: false } });
    });
    const unblockDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield department_1.default.updateOne({ _id: id }, { $set: { isListed: true } });
    });
    const listDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield department_1.default.find({ isListed: true });
    });
    const unlistDepartments = () => __awaiter(void 0, void 0, void 0, function* () {
        return yield department_1.default.find({ listed: false });
    });
    return {
        addDepartment,
        getAllDepartments,
        updateDepartment,
        blockDepartment,
        unblockDepartment,
        listDepartments,
        unlistDepartments,
        getDepartmentbyName,
    };
};
exports.departmentRepositoryMongodb = departmentRepositoryMongodb;
