class PagedResult {
    constructor(page, pageSize) {       
        this.page = page;
        this.pageSize = pageSize;
    }

    set setarray(resultAsArray) {
        this.resultsArray = resultAsArray;
    }

    set setcount(count) {
        this.count = count;
    }

    set setmessage(message) {
        this.message = message;
    }
}

module.exports = { PagedResult };