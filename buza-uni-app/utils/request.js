import config from "@/config.js";

export default {
	console(options) {
		if (config.debug) {
			// console.log("<<===============================================>>");
			// console.log("request start");
			// console.log("header" + JSON.stringify(options.header));
			// console.log("method: " + options.method + " URL: " + options.url);
			// console.log(options.data);
			// console.log("request end");
			// console.log("<<===============================================>>");
		}
	}, //end console
	send(options = {}) { 
		// loading加载
		uni.showLoading({  
			title: 'Loading...'
		});

		options.url = config.app_web_api_url + '' + options.url;
		options.method = options.method || 'POST';

		this.console(options);

		// promise request
		return new Promise((resolve, reject) => {
			uni.request(options).then(data => {
				var [error, res] = data;
				if (error != null) {
					reject(error);
				} else {
					uni.hideLoading();
					// 相应拦截、根据后端的状态码来写，可以自行判断和封装
					// if (res.data.status == '-1001') {
					// 	uni.hideLoading();
					// 	uni.navigateTo({
					// 		url: '/pages/Login/login/login'
					// 	});
					// } else {
						resolve(res.data);
					// }
				}
			})
		});
	}, //end send
	get(url = "", data = {}) {
		return this.send({
			url: url,
			data: data,
			header: {
				'Content-Type':'application/x-www-form-urlencoded'
			},
			method: 'GET'
		})
	}, //end get
	post(url = "", data = {}) {
		return this.send({
			url: url, 
			data: data
		})
	}
}
