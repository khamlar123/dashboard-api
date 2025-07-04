import { Injectable } from '@nestjs/common';
import { Employee } from '../../entity/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeNew } from '../../entity/employee_new.entity';
import { EmployeeLeft } from '../../entity/employee_left.entity';
import * as moment from 'moment';
import { reduceFunc } from '../../share/functions/reduce-func';
import { sortFunc } from '../../share/functions/sort-func';

@Injectable()
export class HrService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(EmployeeNew)
    private readonly employeeNewRepository: Repository<EmployeeNew>,
    @InjectRepository(EmployeeLeft)
    private readonly employeeLeftRepository: Repository<EmployeeLeft>,
  ) {}

  async hrBanner() {
    const [findEmp, findNewEmp, findLeftEmp] = await Promise.all([
      this.employeeRepository.find(),
      this.employeeNewRepository.find(),
      this.employeeLeftRepository.find(),
    ]);

    function checkAge(value: string): number {
      const birthDate = value;
      const age = moment().diff(moment(birthDate, 'YYYY-MM-DD'), 'years');
      return age > 0 ? age : 0;
    }

    const ageList = findEmp.map((m) => checkAge(m.birthDate));

    const sum = reduceFunc(ageList);
    const average = sum / ageList.length;

    const result = {
      banner1: findEmp.length,
      banner2: findNewEmp.length,
      banner3: findLeftEmp.length,
      banner4: +((findLeftEmp.length / findEmp.length) * 100).toFixed(2),
      banner5: +average.toFixed(2),
    };

    return result;
  }

  async employeeBySex() {
    const findEmp = await this.employeeRepository.find();
    const groupData = this.groupBySex(findEmp);

    const sex: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      sex.push(e.sex);
      amount.push(e.amount);
    });

    return {
      label: sex,
      amount: amount,
    };
  }

  async empEducation() {
    const findEmp = await this.employeeRepository.find();
    const groupData = this.groupByEducation(findEmp);

    const education: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      education.push(e.education);
      amount.push(e.amount);
    });

    return {
      label: education,
      amount: amount,
    };
  }

  async empPosition() {
    const findEmp = await this.employeeRepository.find();
    const groupData = this.groupByPosition(findEmp);

    const pos: string[] = [];
    const amount: number[] = [];

    groupData.forEach((e) => {
      pos.push(e.pos);
      amount.push(e.amount);
    });

    return {
      label: pos,
      amount: amount,
    };
  }

  async empAge() {
    const findEmp = await this.employeeRepository.find();

    function checkAge(value: string): number {
      const birthDate = value;
      const age = moment().diff(moment(birthDate, 'YYYY-MM-DD'), 'years');
      return age;
    }

    function getRangeCategory(value: number): number {
      if (value <= 30) {
        return 1;
      } else if (value <= 40) {
        return 2;
      } else if (value <= 50) {
        return 3;
      } else if (value <= 60) {
        return 4;
      } else if (value >= 61) {
        return 5;
      }
      return 0; // Optional: return empty string or throw error if input is invalid
    }

    const mapData = findEmp.map((m) => {
      return {
        ...m,
        age: checkAge(m.birthDate),
        ageCategory: getRangeCategory(checkAge(m.birthDate)),
      };
    });

    const groupData = this.groupByAgeCategory(mapData);

    const male: { label: string[]; amount: number[] } = {
      label: [],
      amount: [],
    };
    const female: { label: string[]; amount: number[] } = {
      label: [],
      amount: [],
    };

    groupData.forEach((item) => {
      const { sex, ...ageGroups } = item;
      const labels = Object.keys(ageGroups);
      const amounts = Object.values(ageGroups);

      if (sex === 'ຊາຍ') {
        male.label = labels;
        male.amount = amounts;
      } else if (sex === 'ຍິງ') {
        female.label = labels;
        female.amount = amounts;
      }
    });

    return {
      male: male,
      female: female,
    };
  }

  async empBranch() {
    const findEmp = await this.employeeRepository.find({
      relations: ['branch'],
    });

    const groupData = this.groupByBranch(findEmp);

    const branch: number[] = [];
    const amount: number[] = [];

    sortFunc(groupData, 'code', 'min').forEach((e) => {
      branch.push(e.branch);
      amount.push(e.amount);
    });

    return {
      label: branch,
      amount: amount,
    };
  }

  private groupBySex(data: any[]) {
    const group: Record<
      string,
      {
        sex: string;
        amount: number;
      }
    > = {};

    data.forEach((e) => {
      const sex = e.sex;

      if (!group[sex]) {
        group[sex] = {
          sex: e.sex,
          amount: 0,
        };
      }
      group[sex].amount += 1;
    });
    return Object.values(group);
  }

  private groupByEducation(data: any[]) {
    const group: Record<
      string,
      {
        education: string;
        amount: number;
      }
    > = {};

    data.forEach((e) => {
      const education = e.education;

      if (!group[education]) {
        group[education] = {
          education: e.education,
          amount: 0,
        };
      }
      group[education].amount += 1;
    });
    return Object.values(group);
  }

  private groupByPosition(data: any[]) {
    const group: Record<
      string,
      {
        pos: string;
        amount: number;
      }
    > = {};

    data.forEach((e) => {
      const pos = e.pos_name;

      if (!group[pos]) {
        group[pos] = {
          pos: pos,
          amount: 0,
        };
      }
      group[pos].amount += 1;
    });
    return Object.values(group);
  }

  private groupByBranch(data: any[]) {
    const group: Record<
      string,
      {
        code: number;
        branch: number;
        amount: number;
      }
    > = {};

    data.forEach((e) => {
      const branch = e.branch.name;

      if (!group[branch]) {
        group[branch] = {
          code: e.branch.code,
          branch: branch,
          amount: 0,
        };
      }
      group[branch].amount += 1;
    });
    return Object.values(group);
  }

  private groupByAgeCategory(data: any[]) {
    const group: Record<
      string,
      {
        sex: string;
        '20-30': number;
        '31-40': number;
        '41-50': number;
        '51-60': number;
        '61+': number;
      }
    > = {};

    data.forEach((e) => {
      const ageCategory = e.ageCategory;
      const age = e.age;
      const sex = e.sex;

      if (!group[sex]) {
        group[sex] = {
          sex: sex,
          '20-30': 0,
          '31-40': 0,
          '41-50': 0,
          '51-60': 0,
          '61+': 0,
        };
      }
      if (ageCategory === 1) {
        group[sex]['20-30'] += 1;
      } else if (ageCategory === 2) {
        group[sex]['31-40'] += 1;
      } else if (ageCategory === 3) {
        group[sex]['41-50'] += 1;
      } else if (ageCategory === 4) {
        group[sex]['51-60'] += 1;
      } else {
        group[sex]['61+'] += 1;
      }
    });
    return Object.values(group);
  }
}
