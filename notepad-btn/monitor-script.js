module.exports = function(runner) {
    var lastLineContent = ''
    var sub = runner.tab.session.output$.subscribe(function(data) {
        var text = data.toString()
        var lines = text.split('\n').filter(function(l) { return l.trim().length > 0 })
        if (lines.length > 0) {
            lastLineContent = lines[lines.length - 1].trim()
        }
        if (lastLineContent.toLowerCase().indexOf('c:') !== -1) {
            runner.sendInput('echo hi\r\n')
            sub.unsubscribe()
        }
    })
}
