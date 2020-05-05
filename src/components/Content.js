import React from "react";
import PropTypes from "prop-types";

export function Content({ file }) {
  const [content, setContent] = React.useState("");

  React.useEffect(() => {
    var resp = new XMLHttpRequest();
    resp.onreadystatechange = () => {
      if (resp.readyState === 4)
        if ([0, 200].includes(resp.status)) {
          setContent(resp.responseText);
        } else {
          console.warn("Failed to open file: ", file);
          console.log("Response: ", resp);
        }
    };
    resp.open("GET", file, true);
    resp.send(null);
  });

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

Content.propTypes = {
  file: PropTypes.string.isRequired
};
