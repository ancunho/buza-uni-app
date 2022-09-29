import request from './request.js';

/**
 * @param {Object} params
 * @description Get OpenId
 */
export function getOpenId(params) {
	return new Promise((resolve, reject) => {
		request.get("/miniapp/api/getOpenId.do", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		})
	}).catch(resError => {
		reject(error)
	});
}

/**
 * @param {Object} params
 * @description Get CustomerDto by customerDto
 * main parameter: openId
 */
export function getCustomerByDto(params) {
	return new Promise((resolve, reject) => {
		request.post("/miniapp/api/getCustomerInfoByDto.do", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		});
	}).catch(resError => {
		reject(error)
	});
};

/**
 * @param {Object} params
 * @description Get post catgory list
 */
export function getPostCategory(params) {
	return new Promise((resolve, reject) => {
		request.post("/miniapp/api/getPostCategory.do", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		});
	}).catch(resError => {
		reject(error)
	});
};

export function getPostListByCodeName(params) {
	return new Promise((resolve, reject) => {
		request.post("/miniapp/api/getPostListByCodeName.do?page=" + params.page + "&limit=" + params.limit, params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		});
	}).catch(resError => {
		reject(error)
	});
};

export function getPostDetailByPostId(params) {
	return new Promise((resolve, reject) => {
		request.post("/miniapp/api/getPostDetailByPostId.do", params).then(result => {
			resolve(result);
		}).catch(error => {
			reject(error);
		});
	}).catch(resError => {
		reject(error)
	});
};



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