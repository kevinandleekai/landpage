var app = new Vue({
	el: '#wrap',
	data: {
		amount: 0,   // 订单数量
		newPrice: 0,  // 新的价格
		oldPrice: 0,  // 优惠后的价格
		orderName: '',
		orderTel: '',
    	areaSelect: false, // 控制地址选择器显示
		areaStatus: 1, // 更新选择之后的地址
		proviceList: [],  // 省份数据
		cityList: [],    //城市数据
		countyList: [], // 县的数据
		provinceState: false, //省份列表数据显示与否状态
		cityState: false, // 城市列表数据显示与否状态
		countyState: false, // 县的列表数据显示与否状态
		checkArea: {
			province: '请选择',  // 已选择的省份
            city: '请选择',  // 已选择的城市
            region: '请选择' // 已选择的县
		},
		maskState: false, // 遮罩层的状态
		fullArea: '请选择地址',   // 省市区地址
		prevProId: '',
		prevCityId: '',
		weixin: 'dfasd55446455555',
		layerShow: false,
		orderLayerShow: false,  // 订单成功后显示的层
		tabContentShow: 1,
		J_TimeHour: 0, // 倒计时小时数据
		J_TimeMin: 0,  // 倒计时分钟数据 
		J_TimeSec: 0,	// 倒计时秒数据
		J_TimeWSec: 0	//倒计时毫秒数据

	},
	mounted: function() {
		this.amount = 1;
		this.newPrice = 298;
		this.oldPrice = 698;

		// 滚动文字
		var ScrollCont = function(opt) {
	        opt = opt || {};
	        if (!(this instanceof ScrollCont)) {
	        	return new ScrollCont(opt);
	        }
	        this.init(opt);
	    };
	    ScrollCont.prototype = {
	        constructor: ScrollCont,
	        init: function(opt) {
	        	var self = this;
	            self.oBox = document.getElementById(opt.parent || "box");
	            var el = self.oBox.children[0];
	            el.innerHTML += el.innerHTML;
	            self.el = el;
	            self.auto();
	        },
	        auto: function() {
	            var self = this;
	            self.timer = setInterval(function(){
	            	// console.log('w:' + self.oBox.scrollTop, 'n:' + self.el.offsetHeight);
	            	// if (self.oBox.scrollTop >= parseInt(self.el.offsetHeight, 10)) {
	            	// 	self.oBox.scrollTop = 0;
	            	// } else {
	            	// 	self.oBox.scrollTop = self.oBox.scrollTop + 1;
	            	// }
	            	var h1 = Math.round(self.oBox.clientHeight);
	            	var h2 = Math.round(self.oBox.scrollHeight);

	            	var half = Math.round((h2 - h1) / 2);

	            	if (self.oBox.scrollTop > half) {
	            		self.oBox.scrollTop = 0;
	            	} else {
	            		self.oBox.scrollTop ++;
	            	}
	            }, 60);
	        }
	    };
	    new ScrollCont({
	    	parent: 'luo-evaluate-all-inner'
	    });
	 	// 提前执行一次倒计时
	    this.getRTime();
	    // 执行倒计时
	    this.timeStart();
	},
	created: function () {
		var __this = this;
		axios.get('/landpage/data/test.json')
		.then(function (response) {
			//地址数据赋值
			var data = response.data;
			//console.log('app.js', data);
			this.proviceList = data;
			//console.log('app.js', this.proviceList);

		})
		.catch(function (error) {
		    console.log(error);
		});
		this.provinceState = true;
		// 加载省份数据
		axios.get('data/test.json')
		.then(function (response) {
			// 后台成功返回的结果处理
			var data = response.data;
			__this.proviceList = [
				{"region_id": "1","region_name": "北京"},
				{"region_id": "2","region_name": "安徽"},
				{"region_id": "3","region_name": "福建"},
				{"region_id": "3","region_name": "湖北"},
				{"region_id": "3","region_name": "河南"},
				{"region_id": "3","region_name": "新疆"},
				{"region_id": "3","region_name": "内蒙"},
			];
		})
		.catch(function (error) {
		    console.log(error);
		});
	},
	methods: {
		operAmount: function(flag) {
			var maxAmount = 1000;
			if (flag > 0) {
				if (this.amount >= maxAmount) {
					return;
				}
				this.amount ++;
				
			} else {
				if (this.amount <= 0) {
					return;
				}
				this.amount --;
			}
		},
		goTobottom: function() {
			this.tabContentShow = 1;
		},
		layerHandle: function() {
			this.layerShow = !this.layerShow;
		},
		orderSuccHandle: function() {
			this.orderLayerShow = !this.orderLayerShow;
		},
		clipText: function() { //复制内容到剪切板
			window.clipboardData.setData('Text',this.weixin);
			alert('复制成功');
		},
		submitOrder: function() {
			var nameReg = /^[\u4E00-\u9FA5]{2,4}$/;
			var telReg = /^13[\d]{9}$|^14[5,7]{1}\d{8}$|^15[^4]{1}\d{8}$|^17[0,6,7,8]{1}\d{8}$|^18[\d]{9}$/;
			var __this = this;

			layui.use(['layer', 'form'], function(){
					var layer = layui.layer
					,form = layui.form;
					var orderName = __this.orderName;
					var orderTel = __this.orderTel;
					if (orderName == '') {
						layer.msg('请输入用户名');
						return false;
					}
					if (!nameReg.test(orderName)) {
						layer.msg('用户名不符合标准');
						return false;
					}
					if (!nameReg.test(orderName)) {
						layer.msg('不符合标准');
						return false;
					}
					if (orderTel == '') {
						layer.msg('请输入手机号');
						return false;
					}
					if (!telReg.test(orderTel)) {
			            layer.msg('请输入有效的手机号');
			            return false;
					}
					var optData = {};  // 发送请求的参数数据
					// axios.post('data/test.json', optData)
					// .then(function (response) {
					// 	//地址数据赋值
					// 	response = response.data;
					//     this.areaList = JSON_;
					// })
					// .catch(function (error) {
					//     console.log(error);
					// });
			});
		},
		maskStatus: function () { // 更改显示状态
       		this.areaSelect = !this.areaSelect;
    	},
    	selectArea: function(num) { // 高亮 省 市 区 其中一个
    		console.log('areaStatus:', num);
    		if (num === 1) {
    			this.provinceState = true;
    			this.cityState = false;
    			this.countyState = false;
    		} else if (num === 2) {
    			this.provinceState = false;
    			this.cityState = true;
    			this.countyState = false;

    		} else if (num === 3) {
    			this.provinceState = false;
    			this.cityState = false;
    			this.countyState = true;
    		} else {
    			this.provinceState = true;
    			this.cityState = false;
    			this.countyState = false;
    		}
    		this.areaStatus = num;

    	},
    	checkProvOne: function (id,name) { // 选择哪个省 id -> 省份id name ->省份名称
    		var __this = this;
            this.checkArea.province = name;
            this.areaStatus = 2;
            this.provinceState = false;  // 隐藏省份的内容
            this.cityState = true;    // 显示城市内容
    		// 获取城市的数据
    		console.log('开始请求城市数据');
    		// 判断当前点击的省份项是否和上一次点击的是一样,如果是一样的省份则不做任何的操作
    		if (typeof this.prevProId != 'undefine' && this.prevProId != id) {
    			this.prevProId = id;
    			this.checkArea.city = '请选择';
    			this.checkArea.region = '请选择';
    			this.cityList = [];
    			this.countyList = [];
    			// 加载省份数据
				axios.get('data/test.json')
				.then(function (response) {
					// 后台成功返回的结果处理
					var data = response.data;
					console.log(data);
					__this.cityList = [
						{"region_id": "1","region_name": "aaaa"},
						{"region_id": "2","region_name": "bbb"},
						{"region_id": "3","region_name": "ccc"}
					];
				})
				.catch(function (error) {
				    console.log(error);
				});
	    		
    		}
        },
        checkCityOne: function (id, name) { 
        	var __this = this;
            this.checkArea.city = name;
    		// 获取城市的数据
    		console.log('开始请求县数据');
            this.cityState = false;  // 隐藏城市的内容
            this.countyState = true;  // 显示县内容
            this.areaStatus = 3 ;
            if (typeof this.prevCityId != 'undefine' && this.prevCityId != id) {
            	this.checkArea.region = '请选择';
            	this.prevCityId = id;
            	this.countyList = [];
	            // 加载对应县数据
				axios.get('data/test.json')
				.then(function (response) {
					// 后台成功返回的结果处理
					var data = response.data;
					console.log(data);
					__this.countyList = [
						{"region_id": "1","region_name": "县1"},
						{"region_id": "2","region_name": "县2"},
						{"region_id": "3","region_name": "县3"},
						{"region_id": "3","region_name": "县4"},
						{"region_id": "3","region_name": "县5"}
					];
				})
				.catch(function (error) {
				    console.log(error);
				});
            }
        },
        checkRegionOne: function (index, name) { // 选择县
            this.checkArea.region = name;
        },
        select: function() {
        	console.log('遮罩事件');
        	var data = this.checkArea.province + this.checkArea.city + this.checkArea.region;
        	this.fullArea = data;
        	this.areaSelect = false;
        },
        changeContentDisplay: function(num) {
        	this.tabContentShow = num;
        },
       	getDateStr: function(AddDayCount) {
       		var dd = new Date();
		    dd.setDate(dd.getDate() + AddDayCount);
		    var y = dd.getFullYear();
		    var m = dd.getMonth() + 1;
		    var d = dd.getDate();
		    return y + "/" + m + "/" + d;
       	},
       	getRTime: function() {
       		var EndTime = new Date(this.getDateStr(1));
		    var NowTime = new Date();
		    var t = EndTime.getTime() - NowTime.getTime();
		    if (t > 0) {
		        var h = Math.floor(t / 1000 / 60 / 60);
		        var m = Math.floor(t / 1000 / 60 % 60);
		        var s = Math.floor(t / 1000 % 60);
		        var w = Math.floor(t / 100 % 10);
		        this.J_TimeHour = (Array(2).join(0) + h).slice(-2);
		        this.J_TimeMin = (Array(2).join(0) + m).slice(-2);
		        this.J_TimeSec = (Array(2).join(0) + s).slice(-2);
		        this.J_TimeWSec = (Array(2).join(0) + w).slice(-2);
		    } 
       	},
       	timeStart: function() {
       		setInterval(this.getRTime, 100);
       	}
	},
	computed: {
		calcNewPrice: function() {
			return '￥' + this.amount * this.newPrice;
		},
		calcOldPrice: function() {
			return '￥' + this.amount * this.oldPrice;
		}
	}
});