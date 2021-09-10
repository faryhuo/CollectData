import {observable, action, useStrict} from 'mobx';

class LicenseInfoStore {
  fileList=[];
  fileMap={};
  excelFile;
  fileName="LicenseInfo.xlsx";
  validExcelFile=false;
}
export default LicenseInfoStore;