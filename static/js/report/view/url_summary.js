class URLSummaryClass {

    constructor() {

    }
    crawl_status_url = crawler_status + ":8555/pstat";
    project_request_url = app_base_url + "report/urlissues";
    crawl_complete = false; //has the crawl completed?
    bulk_select_count = 0;
    input_select_count = 0;
    url_count = 0;
    first_page_url_count = 0;
    heading_sort = "";
    ajax_sort_col = "critical";
    ajax_sort_dir = "DESC";

    version_url_count = 0; //total urls in this version
    current_url_start = 0; //item 1 is actually 0 in db
    first_button = $(".issue-overview-footer  .first span");
    back_button = $(".issue-overview-footer  .back span");
    next_button = $(".issue-overview-footer  .next span");
    last_button = $(".issue-overview-footer  .last span");
    issues_table_container = $("#issues-table tbody");
    display_start_count = $(".issue-overview-footer  .start-count");
    display_send_count = $(".issue-overview-footer  .end-count");
    pagination_stat = $(".issue-overview-footer  .stats");
    critical_head = $(".critical-hd");
    warning_head = $(".warning-hd");
    notice_head = $(".notice-hd");



    template = document.getElementById('issue-url-row-template').innerHTML;

    Prep() {
        this.prepBulkSelect();
        this.prepUrlInputs();
        this.prepVariables();
        this.prepPaginationButtons();
        this.prepHeadings();
    }

    prepVariables() {
        this.version_url_count = CRAWLED_URLS_COUNT;
    }

    prepBulkSelect() {
        $("body").on("click", ".url-bulk-select", function () {
            $(".url-bulk-select .dropdown-menu").toggle();

        });
    }

    prepHeadings() {
        $("body").on("click", ".critical-hd", function () {
            URLSummary.resetHeadings();
            URLSummary.critical_head.children("span").addClass("tx-primary");
            URLSummary.ajax_sort_col = "critical";
            if (URLSummary.heading_sort == "up") {
                URLSummary.critical_head.children(".fa-caret-down").addClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "ASC";
            }else{
                URLSummary.critical_head.children(".fa-caret-down").removeClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "DESC";
            }
            URLSummary.Refresh();

        });

        $("body").on("click", ".warning-hd", function () {
            URLSummary.resetHeadings();
            URLSummary.warning_head.children("span").addClass("tx-primary");
            URLSummary.ajax_sort_col = "warning";
            if (URLSummary.heading_sort == "up") {
                URLSummary.warning_head.children(".fa-caret-down").addClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "ASC";
            }else{
                URLSummary.warning_head.children(".fa-caret-down").removeClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "DESC";
            }
            URLSummary.Refresh();
        });

        $("body").on("click", ".notice-hd", function () {
            URLSummary.resetHeadings();
            URLSummary.notice_head.children("span").addClass("tx-primary");
            URLSummary.ajax_sort_col = "notice";
            if (URLSummary.heading_sort == "up") {
                URLSummary.notice_head.children(".fa-caret-down").addClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "ASC";
            }else{
                URLSummary.notice_head.children(".fa-caret-down").removeClass("fa-caret-up");
                URLSummary.ajax_sort_dir = "DESC";
            }
            URLSummary.Refresh();
        });
    }

    resetHeadings() {
        if (URLSummary.heading_sort == "up") {
            URLSummary.heading_sort = "down";
        } else {
            URLSummary.heading_sort = "up";
        }
        URLSummary.current_url_start = 0;
        $("#issues-table tr th span").removeClass("tx-primary");
    }

    prepPaginationButtons() {
        $("body").on("click", ".issue-overview-footer .next", function () {
            URLSummary.Refresh();
        });

        $("body").on("click", ".issue-overview-footer .last", function () {
            var pages = Math.trunc(URLSummary.version_url_count / 50);
            console.log(URLSummary.version_url_count, Math.trunc(URLSummary.crawledurlcount / 50));
            URLSummary.current_url_start = pages * 50;
            URLSummary.Refresh();
        });

        $("body").on("click", ".issue-overview-footer .first", function () {
            URLSummary.current_url_start = 0;
            URLSummary.Refresh();
        });

        $("body").on("click", ".issue-overview-footer .back", function () {
            URLSummary.current_url_start = URLSummary.current_url_start - 100;
            if (URLSummary.current_url_start < 0) {
                URLSummary.current_url_start = 0;
            }
            URLSummary.Refresh();
        });
    }

    prepUrlInputs() {
        $("body").on("click", "#issues-table tr th input", function () {

            $("#issues-table tr td input").prop("checked", this.checked);


            if (this.checked == true) {
                URLSummary.bulk_select_count = URLSummary.first_page_url_count;
            } else {
                URLSummary.bulk_select_count = 0
            }

            URLSummary.toggleBulkSelect(this.checked);

        });

        $("body").on("click", "#issues-table tr td input", function () {

            if (this.checked == true) {
                URLSummary.bulk_select_count += 1;
            } else {
                URLSummary.bulk_select_count -= 1
            }

            URLSummary.toggleBulkSelect();

        });

    }

    toggleBulkSelect() {
        if (URLSummary.bulk_select_count > 0) {
            $(".url-bulk-select").removeClass("hide");
            $(".issue-url-sel-count").text(this.bulk_select_count);
        } else {

            $(".url-bulk-select").addClass("hide");
        }


    }




    /**
     * refreshes and updates the urls on screen
     * stores a list of thos URLS
     * stores filters, columns, compare etc
     */


    refreshList(data) {
        this.first_page_url_count = 0;
        this.url_count = 0;

        data.forEach(row => {
            this.urlSummary(row.url, row.critical, row.warning, row.notice);
            this.url_count += 1;
        });

        if (this.url_count > 50) {
            this.first_page_url_count = 50;
        } else {
            this.first_page_url_count = this.url_count;
        }



        this.processPagination();
    }

    /**
     * enable/disable page buttons depending on start
     */
    processPagination() {
        console.log(this.version_url_count);
        if (this.current_url_start + 100 >= this.version_url_count) {
            console.log("ended");
            this.next_button.addClass("disabled");
            this.last_button.addClass("disabled");
        } else {
            console.log("not ended");
            this.next_button.removeClass("disabled");
            this.last_button.removeClass("disabled");
        }

        if (this.current_url_start == 0) {
            this.first_button.addClass("disabled");
            this.back_button.addClass("disabled");
        } else {
            this.first_button.removeClass("disabled");
            this.back_button.removeClass("disabled");
        }
        var start = this.current_url_start + 1;
        var end = this.current_url_start + 50;

        if (end > this.version_url_count) end = this.version_url_count;
        this.pagination_stat.text(Util.number_format(start) + " - " + Util.number_format(end) + " of " + Util.number_format(this.version_url_count) + " results");


        this.current_url_start = this.current_url_start + 50;
    }

    /**
     * refreshes the url lists and updates UI
     *  @returns null
     */
    Refresh() {
        $.ajax({
            url: this.project_request_url,
            data: {
                ID: report_id,
                V_ID: version_id,
                START: URLSummary.current_url_start,
                LIMIT: 50,
                SCOPE: OVERVIEW_SCOPE,
                SORT_COL: URLSummary.ajax_sort_col,
                SORT_DIR: URLSummary.ajax_sort_dir

            },
            success: function (sdata) {
                URLSummary.refreshList(sdata);

            },
            error: function (edata, textStatus, errorMessage) {
                console.log(textStatus, errorMessage);
                //@TODO issue with network connectivity
            },
            dataType: "json",
            type: "GET",
            timeout: 200000
        });

        this.issues_table_container.empty();


    }


    /**
     * Polls crawler for new urls, updates UI
     *  @returns null
     */
    PollCrawler() {
        this.crawl_complete = false
        var values = {
            ID: report_id
        };
        $.ajax({
            url: this.crawl_status_url,
            data: JSON.stringify(values),
            success: function (data) {

                console.log(URLSummary.crawl_complete);
                if (data.Stats != null) {
                    var keys = Object.keys(data.Stats);
                    var vals = Object.values(data.Stats);

                    var i;
                    for (i = 0; i < vals.length; i++) {

                        URLSummary.updateURLStats(keys[i], vals[i]);


                    }

                }

                URLSummary.CrawlerRefresh(data);

                URLSummary.crawl_complete = data.Completed


            },

            dataType: "json",
            crossDomain: true,
            type: "POST",
            complete: ZOOKEEPER, // a global call
            timeout: 200000
        });


    }



    issueCountClassColor(val, issueType) {

        var criticalButtonColor = "danger";
        var warningButtonColor = "warning";
        var noticeButtonColor = "secondary";
        var successButtonColor = "success";

        switch (issueType) {
            case "criticalissuescount":
                if (val == 0) return successButtonColor;
                return criticalButtonColor

            case "warningissuescount":
                if (val == 0) return successButtonColor;
                return warningButtonColor

            case "noticeissuescount":
                if (val == 0) return successButtonColor;
                return noticeButtonColor

        }



    }

    /**
     * renders crawled urls directly from crawler
     * @param {*} url 
     * @param {*} stats 
     */
    CrawlerRefresh(data) {
        this.first_page_url_count = 0;
        this.url_count = 0;

        if (data.URLS != null) {

            var keys = Object.keys(data.URLS);
            var vals = Object.values(data.URLS);

            var i;
            for (i = 0; i < vals.length; i++) {


                this.urlSummary(keys[i], vals[i].Stats);
                this.url_count += 1;
            }

            if (this.url_count > 50) {
                this.first_page_url_count = 50;
            } else {
                this.first_page_url_count = this.url_count;
            }

        }
    }


    urlSummary(url, critical, warning, notice) {

        var stats = {};
        stats.url = Util.truncStringPortion(url, 50, 40, 5);
        stats.critical = this.getIssueCountContent(critical);
        stats.criticalbuttoncolor = this.issueCountClassColor(critical, "criticalissuescount");
        stats.warning = this.getIssueCountContent(warning);
        stats.warningbuttoncolor = this.issueCountClassColor(warning, "warningissuescount");
        stats.notice = this.getIssueCountContent(notice);
        stats.noticebuttoncolor = this.issueCountClassColor(notice, "noticeissuescount");
        var row = Mustache.render(this.template, stats);
        $("#issues-table tbody").prepend(row);
    }





    getIssueCountContent(val) {
        var check = '<i class="fa fa-check"></i>';

        if (val == 0) return check;
        return val;



    }

    updateURLStats(type, val) {
        switch (type) {
            case "crawledurlcount":
                this.crawledurlcount(val);
                break;
            case "criticalissuescount":
                this.criticalissuescount(val)
                break;
            case "warningissuescount":
                this.warningissuescount(val)
                break;
            case "noticeissuescount":
                this.noticeissuescount(val)
                break;

        }
    }

    crawledurlcount(val) {
        $("#crawledurlcount").text(Util.number_format(val));

    }

    criticalissuescount(val) {
        $("#criticalissuescount").text(Util.number_format(val));
    }

    warningissuescount(val) {
        $("#warningissuescount").text(Util.number_format(val));
    }

    noticeissuescount(val) {
        $("#noticeissuescount").text(Util.number_format(val));
    }

}