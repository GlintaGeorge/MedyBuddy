// domain/entities/departmentEntity.ts

export default function DepartmentEntity(
    departmentName: string,
    isListed: boolean = true,
    
) {
    return {
        
        getDepartmentName: (): string => departmentName,
        getIsListed: (): boolean => isListed
    };
}

export type DepartmentEntityType = ReturnType<typeof DepartmentEntity>
