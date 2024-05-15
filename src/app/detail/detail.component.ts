import { Component, OnInit } from '@angular/core';
import { TokenService } from '../core/services';
import { VaService } from '../core/services';
import { } from 'electron'

// import {jwtDecode} from "jwt-decode";

// import * as dayjs from "dayjs";
export interface IDoc {
  name: string;
  url: string;
  id: string;
}
interface IVa {
  id: string;
  name: string;
  description: string;
  documents: IDoc[];
}
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  token: string = '';
  titleLogin: string = '';
  isDetail: boolean = false;
  listOfData: IVa[] = [];
  detailData!: IVa
  constructor(private tokenService: TokenService, private vaService: VaService) { }

  //  onToken() {
  //     const serverToken: string = localStorage.getItem('token')!
  //     this.tokenService.apiUsbToken().subscribe((res: {
  //       newAccessToken: string
  //     }) => {
  //       const usbToken: string = res.newAccessToken
  //       const dataServer = jwtDecode(serverToken);
  //       console.log('dataServer', dataServer)
  //       const dataUsb = jwtDecode(usbToken);
  //       console.log('dataUsb', dataUsb)
  //       console.log('dayjs(dataServer.iat)', dayjs(dataServer.iat as number * 1000).format('YYYY-MM-DD HH:mm:ss'))
  //       const diffMinutes = dayjs(dataServer.iat as number * 1000).diff(dayjs(dataUsb.iat as number * 1000), 'minutes');
  //       console.log('diffMinutes', diffMinutes)
  //       console.log('(dayjs(dataUsb.iat)', dayjs(dataUsb.iat as number * 1000).format('YYYY-MM-DD HH:mm:ss'))
  //       console.log(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  //       if (diffMinutes < 15) {
  //         this.titleLogin = "token khớp rồi đăng nhập thành công"
  //         this.token = "token khớp rồi đăng nhập thành công"
  //       } else {
  //         this.titleLogin = "token không khớp đâu nhập lại đi"
  //         this.token = "token không khớp đâu nhập lại đi"
  //       }
  //     })
  //   }
  onViewDetail(id: string) {
    this.isDetail = !this.isDetail;
    this.vaService.apiDetailVa(id).subscribe((data: IVa) => {
      console.log("🚀 ~ DetailComponent ~ this.vaService.apiDetailVa ~ data:", data)
      this.detailData = data;
    });
  }
  onDownload() {
    console.log('onDownload');
    // this.vaService.apiDownVa().subscribe((data: any) => {
    //   console.log("🚀 ~ DetailComponent ~ this.vaService.apiDownVa ~ data:", data)

    // });
    const fileUrl = 'http://192.168.1.44:8082/document/download';

    window.require('electron').ipcRenderer.send('download-file', { downloadUrl: fileUrl, fileName: `Va1.zip` });

    // window.require('electron').ipcRenderer.send('unzip')
    // const folderParent = window.require('fs-jetpack').path('data');
    // try {
    //   const fileZip = window.require('fs-jetpack').find(`ZipData`, { matching: '*.zip' })
    //   if (fileZip[0]) {
    //     const fileName = fileZip[0].split(/[\\/]/).pop();
    //     let fileCount;
    //     do {
    //       await window.require('decompress').decompress(`${folderParent}/${fileName}`, 'ZipData');
    //     } while ([...fileZip].length === fileCount);
    //     window.require('fs-jetpack').remove(`${folderParent}/${fileName}`);
    //     alert(`decompress`);
    //   }
    // } catch (_error) {
    //   alert(`file decompress failed.`);
    // }
  }
  ngOnInit(): void {
    console.log('khởi tạo');
    this.vaService.apiGetVa().subscribe((data: IVa[]) => {
      this.listOfData = data;
    })
  }
}
