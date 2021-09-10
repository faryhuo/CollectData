import React from 'react';
import { Upload, Button,Modal,Alert,message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './ExcelUploadPage.styl';
const { Dragger } = Upload;

import axios from 'axios';
import { Observer } from 'mobx-react';

@Observer
class ExcelUploadPage extends React.Component {
    constructor(props) {
        super(props);
        //react state
        let self=this;
        this.state={
            multiple:false,
            enableNext:this.props.licenseInfoStore.validExcelFile,
            name:"excelFile",
            showUploadList:{
                showDownloadIcon: false,
                showRemoveIcon: false
            },
            errorMessage:"",
            fileList:[],
            excelFile:this.props.licenseInfoStore.excelFile,
            action:"",
            uploading: false,
            beforeUpload: file => {
                self.setState(state => ({
                    excelFile: file,
                    fileList:[file]
                }),()=>{
                    self.props.licenseInfoStore.excelFile=file;
                    console.log(self.props.licenseInfoStore);
                    self.handleUpload();
                });
                return false;
            }
        }
        if(this.props.licenseInfoStore.excelFile && this.props.licenseInfoStore.validExcelFile){
            this.state.fileList.push(this.props.licenseInfoStore.excelFile)
        }
    }
    destroyAll() {
        Modal.destroyAll();
    }

    handleUpload (){
        let self=this;
        const formData = new FormData();
        formData.append("excelFile",this.state.excelFile);
        axios({
          url: '/checkExcelFile',
          method: 'post',
          processData: false,
          data: formData,
          responseType: 'json'})
          .then((res) => { 
            console.log(res);
            if(res.status===200 && res.data.status===0){
                self.setState({
                    enableNext:true,
                    errorMessage:""
                },()=>{
                    self.props.licenseInfoStore.validExcelFile=true;
                });
                
            }else{
                self.setState({
                    enableNext:false
                },()=>{
                    self.props.licenseInfoStore.validExcelFile=false;
                });
                if(res.data.message){
                    let message=<pre>{res.data.message}</pre>;
                    self.setState({
                        errorMessage:message
                    });
                }
            }
        }).catch(function(error){
            console.log(error);
            self.setState({
                enableNext:false,
                errorMessage:"Has internal server error, please check the log file."
            },()=>{
                self.props.licenseInfoStore.validExcelFile=false;
            });
            //self.props.showMessage("Has internal server error, please check the log file.");
        });
    }

    downloadFile(){
        const licenseInfoStore=this.props.licenseInfoStore;
        const self=this;
        axios({
            url: '/downloadFile',
            method: 'post',
            processData: false,
            responseType: 'blob'})
            .then((res2) => { // 处理返回的文件流
              const content = res2.data;
              const blob = new Blob([content]);
              let fileName=licenseInfoStore.fileName;
              if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
              } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName);
              }
              self.props.homePageStore.closeLoading();
          }).catch(function(error){
              console.log(error);
              self.props.homePageStore.closeLoading();
          });
    }

    submit (){
        this.props.homePageStore.showLoading();
        const self=this;
        const formData = new FormData();
        const licenseInfoStore=this.props.licenseInfoStore;
        if(licenseInfoStore.fileList.length===0 || !licenseInfoStore.excelFile){
            this.props.showMessage("Please confrim if upload the excel file and html file.");
            return;
        }
        for(let item in licenseInfoStore.fileList){
          let file=licenseInfoStore.fileList[item];  
          formData.append('files', file);
        }
        formData.append("excelFile",licenseInfoStore.excelFile);
        axios({
          url: '/download',
          method: 'post',
          processData: false,
          data: formData,
          responseType: 'json'})
          .then((res) => { 
            self.downloadFile();
            self.props.nextStep(3);
        }).catch(function(error){
            console.log(error);
            self.props.homePageStore.closeLoading();
        });
        
    }



    uploadExcel(e){
        console.log(e);
        //e.preventDefault();
        //return true;
        if(!this.state.UploadBtn.files.length){
            return;
        }
        let file=this.state.UploadBtn.files[0];
        this.setState({excelFile:file,excelName:file.name});
    }

    setUploadBtnRef = element => {
        this.state.UploadBtn = element;
    };

    render() {
        return (
            <div className="ExcelUploadPage" >
                <form  action="/" method="post"  onSubmit={(e)=>{console.log(e);}}>
                    <div style={{"textAlign":"center"}}>
                        <h2>Upload the excel file</h2>
                    </div>
                    <div >
                    <Dragger {...this.state} accept=".xls,.xlsx">
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                        band files
                        </p>
                    </Dragger>
                    </div>
                </form>  
                <div>
                 {  this.state.errorMessage && <Alert message={this.state.errorMessage} type="error" />}
                </div>  
                <div  className="action-button">
                    <Button disabled={!this.state.enableNext} type="primary" onClick={()=>{this.submit()}}>Next</Button>
                </div>
            </div>
        );
    }
}

export default ExcelUploadPage;