/**
*==================================================
Copyright [2021] [HCL Technologies]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*==================================================
**/
import Axios, { AxiosPromise, AxiosRequestConfig } from "axios";


const VOICE_URL ="<FIREBASE_VOICE_SEARCH_URL>";
const IMAGE_URL ="<FIREBASE_IMAGE_SERACH_URL>";
  
const voiceImageTranscibeService = {
  getVoiceTranscribeText(audioBytes, channelCount): AxiosPromise<any> {
    let requestOptions: AxiosRequestConfig = Object.assign({
      data: { audioBytes, channelCount },
      url: VOICE_URL,
      method: "post"
    });
    return Axios(requestOptions);
  },
  getImageTranscibetext(imageBytes): AxiosPromise<any> {
    let requestOptions: AxiosRequestConfig = Object.assign({
      data: { imageBytes },
      url: IMAGE_URL,
      method: "post"
    });
    return Axios(requestOptions);
  }
};

export default voiceImageTranscibeService;
