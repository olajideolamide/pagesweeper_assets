class GlobalRefreshButtonClass {
    constructor() {

    }

    element = $(".global-refresh-btn i");

    start() {

    }

    stop() {
        this.element.removeClass("fa-spin");
    }
}






var Util = new UtilClass();
var URLSummary = new URLSummaryClass();
URLSummary.Prep();
var GlobalRefreshButton = new GlobalRefreshButtonClass();





function ZOOKEEPER() {
    //checks if the current report's version is complete

    if (URLSummary.crawl_complete === false) {
        URLSummary.PollCrawler() //for crawler
    } else {
        URLSummary.Refresh();
        GlobalRefreshButton.stop();

    }



}

if (in_progress === true) {
    ZOOKEEPER();
} else {
    URLSummary.Refresh();
    GlobalRefreshButton.stop();
}