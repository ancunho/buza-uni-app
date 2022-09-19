import request from './request.js';


export function getOpenId(params) {
	return new Promise((resolve, reject) => {
		request.get("/miniapp/api/getOpenId.do", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		})
	});
}

export function getPostList(params) {
	return new Promise((resolve, reject) => {
		request.post("/post/list", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		})
	});
}



// export function httpGet(url, params) {
// 	return new Promise((resolve, reject) => {
// 		request.get(url, params).then((result) => {
// 			resolve(result)
// 		}).catch(err => {
// 			reject(err)
// 		});
// 	});
// }

// export function httpPost(url, params) {
//   return new Promise((resolve, reject)=>{
//       request.post(url, params).then((result)=>{
//           resolve(result)
//       }).catch(err=>{
//           reject(err)
//       });
//   });
// }