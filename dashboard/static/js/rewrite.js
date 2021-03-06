(function (L) {
    var _this = null;
    L.Rewrite = L.Rewrite || {};
    _this = L.Rewrite = {
         data: {
            rules: {},
        },

        init: function () {
            _this.loadConfigs();
            _this.initEvents();

        },

        initEvents: function(){
            L.Common.initRuleAddDialog("rewrite", _this);//添加规则对话框
            L.Common.initRuleDeleteDialog("rewrite", _this);//删除规则对话框
            L.Common.initRuleEditDialog("rewrite", _this);//编辑规则对话框
            L.Common.initSyncDialog("rewrite", _this);//编辑规则对话框

            L.Common.initConditionAddOrRemove();//添加或删除条件
            L.Common.initJudgeTypeChangeEvent();//judge类型选择事件
            L.Common.initConditionTypeChangeEvent();//condition类型选择事件

            L.Common.initExtractionAddOrRemove();//添加或删除条件
            L.Common.initExtractionTypeChangeEvent();//extraction类型选择事件
            L.Common.initExtractionAddBtnEvent();//添加提前项按钮事件
            L.Common.initExtractionHasDefaultValueOrNotEvent();//提取项是否有默认值选择事件

            
            L.Common.initViewAndDownloadEvent("rewrite");

            L.Common.initSwitchBtn("rewrite");//rewrite关闭、开启

        },

        
        buildRule: function(){
            var result = {
                success: false,
                data: {
                    name: null,
                    judge:{},
                    extractor: {},
                    handle:{}
                }
            };

            //build name and judge
            var buildJudgeResult = L.Common.buildJudge();
            if(buildJudgeResult.success == true){
                result.data.name = buildJudgeResult.data.name;
                result.data.judge = buildJudgeResult.data.judge;
            }else{
                result.success = false;
                result.data = buildJudgeResult.data;
                return result;
            }

            //build extractor
            var buildExtractorResult = L.Common.buildExtractor();
            if (buildExtractorResult.success == true) {
                result.data.extractor = buildExtractorResult.data.extractor;
            } else {
                result.success = false;
                result.data = buildExtractorResult.data;
                return result;
            }

            //build handle
            var buildHandleResult = _this.buildHandle();
            if(buildHandleResult.success == true){
                result.data.handle = buildHandleResult.handle;
            }else{
                result.success = false;
                result.data = buildHandleResult.data;
                return result;
            }

            //enable or not
            var enable = $('#rule-enable').is(':checked');
            result.data.enable = enable;

            result.success = true;
            return result;
        },

        

        buildHandle: function(){
            var result = {};
            var handle = {};
            var uri_tmpl = $("#rule-handle-uri-template").val();
            if (!uri_tmpl) {
                result.success = false;
                result.data = "rewrite使用的uri template不得为空";
                return result;
            }
            handle.uri_tmpl = uri_tmpl;
            handle.log = ($("#rule-handle-log").val() === "true");
            result.success = true;
            result.handle = handle;
            return result;
        },

        loadConfigs: function () {
            $.ajax({
                url: '/rewrite/configs',
                type: 'get',
                cache:false,
                data: {},
                dataType: 'json',
                success: function (result) {
                    if (result.success) {
                        L.Common.resetSwitchBtn(result.data.enable, "rewrite");
                        $("#switch-btn").show();
                        $("#view-btn").show();
                        _this.renderTable(result.data);//渲染table
                        _this.data.enable = result.data.enable;
                        _this.data.rules = result.data.rules;//重新设置数据

                    }else{
                        L.Common.showTipDialog("错误提示", "查询rewrite配置请求发生错误");
                    }
                },
                error: function () {
                    L.Common.showTipDialog("提示", "查询rewrite配置请求发生异常");
                }
            });
        },

        renderTable: function(data, highlight_id){
            highlight_id = highlight_id || 0;
            var tpl = $("#rule-item-tpl").html();
            data.highlight_id = highlight_id;
            var html = juicer(tpl, data);
            $("#rules").html(html);
        }
    };
}(APP));