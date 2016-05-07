var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        <h1>Url Shortenner</h1>
        <UrlShortenner url="/api/urlShortenner" />
        <div id="shortUrl"/>
      </div>
    );
  }
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


var UrlShortenner = React.createClass({
  getInitialState: function() {
    return {urlStr: ''};
  },
  handleUrlChange: function(e) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
    this.setState({urlStr: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log(e);
    var urlStr = this.state.urlStr.trim();
    if(!urlStr){
      return;
    }
    console.log(urlStr.hashCode());
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'GET',
      data: urlStr,
      success: function(data) {
        console.log("successs");
        this.setState({data: data});
        $("#shortUrl").html("shortened url:" + '<a href='+data.url+'>'+data.url+'</a>');
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("errrror");
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    this.setState({url: ''});
  },
  render: function () {
    return (
      <form className="urlShortenner" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="http://yikyak.com"
          value={this.state.urlStr}
          onChange={this.handleUrlChange}
        />
        <input type="submit" value="Get" />
      </form>
    );
  }
});


ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
