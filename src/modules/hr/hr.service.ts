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
    // const findEmp = await this.employeeRepository.find();
    // console.log('findEmp', findEmp);
    // const groupData = this.groupByPosition(findEmp);
    //
    // const pos: string[] = [];
    // const amount: number[] = [];
    //
    // groupData.forEach((e) => {
    //   pos.push(e.pos);
    //   amount.push(e.amount);
    // });
    //
    // return {
    //   label: pos,
    //   amount: amount,
    // };

    //fake data
    const fakeItem = {
      label: [
        'ຄະນະອຳນວຍການ',
        'ຄະນະພະແນກ, ຄະນະສາຂາ',
        'ທີ່ປຶກສາສະເພາະດ້ານ',
        'ຄະນະຂະແໜງ, ຄະນະໜ່ວຍບໍລິການ',
        'ພະນັກງານວິຊາການ',
      ],
      amount: [1, 2, 3, 4, 5],
    };
    return fakeItem;
  }

  async empAge() {
    const findEmp = await this.employeeRepository.find();

    function checkAge(value: string): number {
      const birthDate = value;
      const age = moment().diff(moment(birthDate, 'YYYY-MM-DD'), 'years');
      return age;
    }

    function getRangeCategory(value: number): number {
      if (value <= 28) {
        return 1;
      } else if (value <= 44) {
        return 2;
      } else if (value <= 60) {
        return 3;
      } else if (value <= 79) {
        return 4;
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

    function getGeneration(age: number): string {
      if (age >= 13 && age <= 28) return 'Gen Z';
      if (age >= 29 && age <= 44) return 'Gen Y';
      if (age >= 45 && age <= 60) return 'Generation X';
      if (age >= 61 && age <= 79) return 'Baby Boomers';
      return 'Other';
    }

    function groupByGeneration(data: any[]) {
      const counts: Record<string, number> = {
        'Gen Z': 0,
        'Gen Y': 0,
        'Generation X': 0,
        'Baby Boomers': 0,
      };

      data.forEach((person) => {
        const gen = getGeneration(person.age);
        if (counts[gen] !== undefined) {
          counts[gen]++;
        }
      });

      return {
        labels: Object.keys(counts),
        values: Object.values(counts),
      };
      // return {
      //   detail: [
      //     'Gen Z (13 - 28)',
      //     'Gen Y (29 - 44)',
      //     'Generation X (45 - 60)',
      //     'Baby Boomers (61 - 79)',
      //   ],
      //   lables: [],
      //   values: [],
    }

    const result = groupByGeneration(mapData);

    return result;
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
        age: string;
        'Gen Z': number;
        'Gen Y': number;
        'Generation X': number;
        'Baby Boomers': number;
      }
    > = {};

    data.forEach((e) => {
      const ageCategory = e.ageCategory;
      const age = e.age;
      const sex = e.sex;

      if (!group[age]) {
        group[age] = {
          age: age,
          'Gen Z': 0,
          'Gen Y': 0,
          'Generation X': 0,
          'Baby Boomers': 0,
        };
      }
      //z 13-28
      //y 29-44
      //x 45 - 60
      //Baby Boomers 61 - 79
      if (ageCategory === 1) {
        group[age]['Gen Z'] += 1;
      } else if (ageCategory === 2) {
        group[age]['Gen Y'] += 1;
      } else if (ageCategory === 3) {
        group[age]['Generation X'] += 1;
      } else if (ageCategory === 4) {
        group[age]['Baby Boomers'] += 1;
      }
    });
    return Object.values(group);
  }
}
