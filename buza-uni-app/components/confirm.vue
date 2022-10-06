<template>
	<view class="Confirm">
			<!-- 弹出层提示框 -->
			<u-popup :mask-close-able="false" :width="width" v-model="isShow" :mode="mode" border-radius="30">
				<view class="pop-box">
					<view class="title">
						{{title}}
					</view>
					<view class="content">
						{{content}}
					</view>
					<view class="bottom-Bnts">
						<button v-if="showClose" @click="ClickEvent('cancle')" hover-class="_active-hover" :plain="true"
							class="close-btn btns-item  ">
							{{closeText}}
						</button>
						<button v-if="showSumbit" @click="ClickEvent('sumbit')" hover-class="_active-hover" :plain="true"
							class="sumbit-btn btns-item">
							{{sumbitText}}
						</button>
					</view> 
				</view>
			</u-popup>
		</view>
</template>

<script>
	export default {
			props: {
				//是否显示弹出层 
				width: {
					type: String, //宽度大小rpx
					default: '600'
				},
				mode: {
					type: String,
					default: 'center', //默认中间弹出
				},
				borderRadius: {
					type: Number || String,
					default: 16, //默认16圆角边框
				},
				sumbitText: {
					type: String,
					default: '确定'
				},
				closeText: {
					type: String,
					default: '取消'
				},
				showClose:{
					type:Boolean,
					default:true
				}, //是否显示取消按钮
				showSumbit:{
					type:Boolean,
					default:true,
					//是否显示确认按钮
				}
			},
			data() {
				return {
					data: '', //数据
					isShow: false, //是否显示弹出层
					content: '', //内容
					title: '', //标题
				}
			},
			methods: {
				ClickEvent(type) {
					this.isShow = false;
					this.data.callback(type);
				},
				open(data) {
					this.title = data.title || '标题';
					this.content = data.content || '内容';
					this.data = data;
					this.isShow = true;
				},
			}
		}
</script>

<style lang="scss">
	.Confirm {
 
		//pop弹出层
		.pop-box {
			.title {
				padding: 20rpx;
				font-size: 34rpx;
				font-weight: bold;
				width: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
 
			.content {
				display: flex;
				flex-wrap: wrap;
				font-size: 26rpx;
				justify-content: center;
				align-items: center;
				padding: 50rpx;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				color: #666666;
				font-weight: 400;
				text-align: center;
				letter-spacing: 3rpx;
			}
 
			.line-block {
				width: 100%;
				height: 1rpx;
				background-color: #eee;
				margin: 30rpx 0;
			}
 
			.close-btn {
				border: 0;
				font-size: 28rpx;
				padding-bottom: 20rpx;
				color: #000;
				font-weight: 500;
				line-height: 1;
			}
 
			.sumbit-btn {
				border: 0;
				font-size: 28rpx;
				padding-bottom: 20rpx;
				color: red;
				font-weight: 500;
				line-height: 1;
				border-left: 1px solid #fff;
				border-radius: 0;
			}
 
			.bottom-Bnts {
				display: flex;
				margin-top: 20rpx;
				border-top: 1rpx solid #eee;
				width: 100%;
				background-color: #Fff;
				justify-content: space-around;
				align-items: center;
 
				.btns-item {
					width: 50%;
					padding: 30rpx;
					border-radius: 0;
					font-size: 30rpx;
					font-weight: 500;
				}
 
				.one-btn-click {
					border: 0;
					font-size: 28rpx;
					padding-bottom: 20rpx;
					font-weight: 500;
					line-height: 1;
					color: #2585FD;
				}
 
				.sumbit-btn {
					border-left: 1rpx solid #eee;
				}
			}
		}
 
	}
</style>