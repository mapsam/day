import { useEffect, useState } from 'react';
import { weekday, zeros } from '../utils/date.js';
import { linkify } from '../utils/linkify.js';

const dayTextStyle = {
  whiteSpace: 'pre-wrap'
};

const controlsStyle = {
  letterSpacing: '0.1em',
  fontSize: '0.85em',
};

const Day = props => {
  const [text, setText] = useState(props.children.text);
  const [visualText, setVisualText] = useState(linkify(text));
  const [edit, setEdit] = useState(false);
  const [editText, setEditText] = useState(props.children.text);
  const [hover, setHover] = useState(false);
  const [deleteConf, setDeleteConf] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const query = `?year=${props.children.year}&month=${props.children.month}&day=${props.children.day}`;
  const permalink = `/days${query}`;

  const updateDay = async(e) => {
    e.preventDefault();
    setLoading(true);

    if (editText == text) {
      console.log('no changes to save');
      return;
    };

    const body = {
      year: props.children.year,
      month: props.children.month,
      day: props.children.day,
      text: editText
    };

    const response = await fetch('/api/days', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    await response.json();
    setText(editText);
    setVisualText(linkify(editText));
    setEdit(false);
    setLoading(false);
  };

  const deleteDay = async(e) => {
    e.preventDefault();

    const body = {
      year: props.children.year,
      month: props.children.month,
      day: props.children.day
    };

    await fetch('/api/days', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    setDeleted(true);
  };

  if (deleted || props.children.empty) return (<div></div>);

  return (
    <div
      className="columns mb-6"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      key={props.children._id}>
      <div className="column " key={props.children._id + '-date'}>
        <div className="content has-text-weight-semibold is-size-5">
          <span className="content">{props.children.year}</span>
          <span className="content mx-1 has-text-dark">.</span>
          <span className="content">{zeros(props.children.month)}</span>
          <span className="content mx-1 has-text-dark">.</span>
          <span className="content">{zeros(props.children.day)}</span>
          <br />
          <span className="has-text-grey-light has-text-weight-light is-size-6">
            {weekday(props.children.weekday - 1)}
          </span>
        </div>
      </div>
      <div className="column is-three-quarters has-text-weight-medium" style={dayTextStyle} key={props.children._id + '-content'}>
        {!edit &&
          <div className="content">

            {/* CONTENT HERE */}
            <p className="content has-text-weight-normal" dangerouslySetInnerHTML={{__html: visualText}}></p>
            {/* END CONTENT */}

            <div className={hover ? '' : 'is-invisible-desktop'} style={controlsStyle}>
              <div className="columns buttons are-small has-text-weight-semibold">
                <div className="column is-one-fifth">
                  <a className="button is-ghost is-fullwidth" href={permalink}>🔗</a>
                </div>
                <div className="column is-one-fifth">
                  <a className="button is-ghost is-fullwidth" onClick={e => setEdit(true)}>✏️</a>
                </div>
                <div className="column is-one-fifth">
                  {deleteConf &&
                    <a className="button is-danger is-fullwidth" onClick={deleteDay}>🔪 ?</a>
                  }
                  {!deleteConf &&
                    <a className="button is-ghost is-fullwidth" onClick={e => setDeleteConf(true)}>🔪</a>
                  }
                </div>
                <div className="column is-one-fifth">
                  {deleteConf &&
                    <a className="button is-light" onClick={e => setDeleteConf(false)}>🙅‍♀️ nvm</a>
                  }
                </div>
              </div>
            </div>
          </div>
        }
        {edit &&
          <form>
            <div className="field">
              <textarea
                className="textarea"
                rows="12"
                value={editText}
                onChange={e => setEditText(e.target.value)}>
              </textarea>
            </div>
            <div className="buttons are-small">
              <button
                type="submit"
                className={loading ? "button is-primary has-text-weight-semibold is-loading" : "button is-primary has-text-weight-semibold"}
                onClick={updateDay}>💾
              </button>
              <button
                className="button is-light has-text-weight-semibold"
                onClick={e => setEdit(false)}>🙅‍♀️ nvm
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
};

export default Day;