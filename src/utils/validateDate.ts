import { validateDate } from '../interfaces/types';

function validateDateFunc(date: string): boolean {
  //month needs to be 2 digital , otherwise octokit will throw error
  const re = /([12]\d{3}-(0[1-9]|1[0-2])$)/;
  return re.test(date);
}
const validateDate: validateDate = validateDateFunc;
export default validateDate;
