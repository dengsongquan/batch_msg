/**
 * $ajax with vue
 * this.$ajax({
        action:'http://localhost:3000/upload',
        method:'post',
        data:{},
        headers: {
            'Content-type':'multipart/form-data'
            // 'Content-type':'application/x-www-form-urlencoded'
            // 'Content-type':'application/json'
        },
        config:{
            timeout:100000
        },
        progress:function(){
            // console.log(1);
        },
        success:function(){
            console.log('上传成功');
        },
        error:function(){
            console.log('上传失败')
        },
        // 超时回调
        timeout:function(){

        }
    })
 */

(function(global){
    if(!global){
        console.error('找不到Vue');
        return;
    }
    function getError(action, method, xhr) {
        var msg;
        if (xhr.response) {
            msg = xhr.response.error || xhr.response;
        } else if (xhr.responseText) {
            msg = xhr.responseText;
        } else {
            msg = 'fail to' + method + action + xhr.status;
        }

        var err = new Error(msg);
        err.status = xhr.status;
        err.method = method;
        err.url = action;
        return err;
    }

    function getBody(xhr) {
        var text = null;
        if(xhr.responseType==='blob'){
            text = xhr.response;
        }else{
            text = xhr.responseText || xhr.response;
        }

        if (!text) {
            return text;
        }

        try {
            return JSON.parse(text);
        } catch (e) {
            return text;
        }
    }

    function $ajax (option) {
        var formData = new FormData();
        if (typeof XMLHttpRequest === 'undefined') {
            return;
        }
        var xhr = new XMLHttpRequest();
        var action = option.action;
        var method = option.method;
        var data = option.data;

        if (xhr.upload) {
            xhr.upload.onprogress = function progress(e) {
                if(e.total > 0){
                    e.percent = e.loaded / e.total * 100;
                }
                if(option.progress){
                    option.progress(e);
                }
            };
        }

        if(option.error){
            xhr.onerror = function error(e) {
                option.error(e);
            };
        }

        if(option.timeout){
            xhr.ontimeout = function timeout(e) {
                option.timeout(e);
            }
        }

        xhr.onload = function onload() {
            if (xhr.status < 200 || xhr.status >= 300) {
                if(option.error){
                    return option.error(getError(action, method, xhr), getBody(xhr));
                }
            }else if(option.success){
                option.success(getBody(xhr));
            }
        };

        xhr.open(method, action, true);

        if(option.config){
            for(var key in option.config){
                if(key in xhr){
                    xhr[key] = option.config[key];
                }
            }
        }

        var headers = option.headers || {};
        for (var item in headers) {
            if (headers.hasOwnProperty(item) && headers[item] !== null) {
                try {
                    xhr.setRequestHeader(item, headers[item]);
                } catch (error) {
                    console.warn('无法设置请求头');
                }
            }
        }

        //2020-11-04新增 传递参数的格式 Dengxiaohang
        xhr.send(data);
    }

    global.prototype.$ajax = $ajax;
})(Vue || null)