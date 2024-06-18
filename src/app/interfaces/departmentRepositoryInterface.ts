import { departmentRepositoryMongodbType } from "../../frameworks/database/mongodb/repositories/departmentRepositoryMongodb";


export const departmentDbRepository = (repository: ReturnType<departmentRepositoryMongodbType>) => {

    const addDepartment = async (department: any) => await repository.addDepartment(department);

    const getDepartmentbyName = async (deparmentName:string) =>repository.getDepartmentbyName(deparmentName)

    const getAllDepartments = async () => await repository.getAllDepartments();

  const updateDepartment = async (id: string, department: string) => await repository.updateDepartment(id, department);

  const blockDepartment = async (id: string) => await repository.blockDepartment(id);

  const unblockDepartment = async (id: string) => await repository.unblockDepartment(id);

  const listDepartments = async () => await repository.listDepartments();

  const unlistDepartments = async () => await repository.unlistDepartments();


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

export type IDepartmentRepository = typeof departmentDbRepository;
