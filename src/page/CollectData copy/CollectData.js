import React from 'react';
import { Upload, Button,Modal} from 'antd';
import { UploadOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import {  message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'page/CollectData/CollectData.styl';
const { Dragger } = Upload;

import axios from 'axios';

class CollectData extends React.Component {
    constructor(props) {
        super(props);
        //react state
        this.state={
            multiple:true,
            name:"files",
            showUploadList:{
                showDownloadIcon: false,
                showRemoveIcon: false
            },
            fileList:[],
            fileMap:{},
            action:"",
            uploading: false,
            beforeUpload: file => {
                let fileMap=this.state.fileMap;
                //file[]
                if(fileMap[file.name]){
                    if(fileMap[file.name].lastModifiedDate<file.lastModifiedDate){
                        fileMap[file.name]=file;
                        this.setState({
                            fileMap: fileMap
                        });
                    }
                }else{
                    fileMap[file.name]=file;
                    this.setState({
                        fileMap: fileMap
                    });
                }
                this.setState(state => ({
                    fileList: [...state.fileList, file],
                }));
                return false;
            }
        }
    }
    destroyAll() {
        Modal.destroyAll();
    }
      
    showConfirm(msg) {
        const { confirm } = Modal;
        let self=this;
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <div >{msg}</div>,
            onOk() {
                self.destroyAll()
            },
            onCancel() {
                self.destroyAll()
            },
        });       
      }
    handleUpload (){
        const {fileMap}  = this.state;
        const formData = new FormData();
        if(this.state.fileList.length===0 || !this.state.excelFile){
            this.showConfirm("Please confrim if upload the excel file and html file.");
            return;
        }
        for(let item in fileMap){
          let file=fileMap[item];  
          formData.append('files', file);
        }
        formData.append("excelFile",this.state.excelFile);
        axios({
          url: '/download',
          method: 'post',
          excelName:"",
          excelFile:{},
          processData: false,
          data: formData,
          responseType: 'blob'})
          .then((res2) => { // 处理返回的文件流
            const content = res2.data;
            const blob = new Blob([content]);
            let fileName="computerInfo.xls";
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
        }).catch(function(error){
            console.log(error);
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
            <div className="CollectData" >
                <form  action="/download" method="post" enctype="multipart/form-data" onSubmit={(e)=>{console.log(e);}}>
                    <div style={{"textAlign":"center"}}>
                        <h2>Convert the html file to excel</h2>
                    </div>
                    <div >
                    <Dragger {...this.state}>
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
                    <div  style={{"textAlign":"center","marginTop":"15px"}}>
                        <Button type="file"  icon={<UploadOutlined />}  onClick={(e)=>{this.state.UploadBtn.click()}}>Upload Excel</Button>
                        <input accept=".xls,.xlsx" name="excelFile" type="file" ref={(e)=>{this.setUploadBtnRef(e)}} onChange={(e)=>{this.uploadExcel(e)}} style={{display:"none"}}></input>
                        &nbsp;&nbsp;<label>{this.state.excelName}</label>
                    </div>
                    <div  style={{"textAlign":"center","marginTop":"15px"}}>
                        <Button icon={<UploadOutlined />} onClick={(e)=>{this.handleUpload(e)}}>Download</Button>
                    </div>
                </form>    
                <Button type="primary" onClick={()=>{this.props.nextStep()}}>Next</Button>
            </div>
        );
    }
}

export default CollectData;