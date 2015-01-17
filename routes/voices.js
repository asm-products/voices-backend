var voices = {

    getAll: function(req, res) {
        res.json(data);
    }
};

var data = [{
    name: 'voice 1',
    id: '1'
}, {
    name: 'voice 2',
    id: '2'
}];

module.exports = voices;
