import React, { useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledInput = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  background-color: transparent;

  border-radius: 0.25rem;
  box-shadow: 0 0 0 0.1rem #393e46;

  margin: 0.25rem;

  width: 100%;
  height: 1rem;

  pointer-events: ${(props) => (props.disabled ? `none` : `auto`)};
`;

const InputRange = styled.input`
  background-color: transparent;
  appearance: none;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  z-index: 1;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 0px;
    height: 0px;
    background: rgba(0, 0, 0, 0);
    border: 0px solid rgba(0, 0, 0, 0);
  }

  &::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    border: none;
    border-radius: 0px;
  }
`;

const HoverInputRange = styled.div.attrs(({ value, max }) => ({
  style: {
    width: `${(value / max) * 100}%`,
    display: (value / max) * 100 >= 0 ? `block` : `none`,
  },
}))`
  margin-left: -100%;
  height: 1rem;
  z-index: 0;
  transition: all 0.25s ease-out;

  border-radius: 0.25rem;

  background-color: ${(props) => (props.disabled ? `#818489` : `#393e46`)};
  box-shadow: 0 0 0 1px ${(props) => (props.disabled ? `#818489` : `#393e46`)};

  ${StyledInput}:hover & {
    background-color: #61656b;
    box-shadow: 0 0 0 1px #61656b;
  }

  ${StyledInput}:active & {
    background-color: #2e3238;
    box-shadow: 0 0 0 1px #2e3238;
  }
`;

const ContentInput = styled.div.attrs(
  ({ value, max, widthInput, widthHover, widthContent }) => ({
    style: {
      left:
        (value / max) * 100 >= 0
          ? widthInput - widthHover <= widthContent / 2
            ? `calc(100% - (${widthContent}px))`
            : widthHover >= widthContent / 2
            ? `calc( ${(value / max) * 100}% - (${widthContent}px / 2))`
            : `0%`
          : `calc(100% - (${widthContent}px))`,
      color: (value / max) * 100 >= 0 ? `#f2f2f2` : `#25282d`,
    },
  })
)`
  position: absolute;
  z-index: 0;

  width: max-content;

  text-align: center;

  pointer-events: none;
  user-select: none;

  transition: all 0.25s ease-out;

  opacity: 0;

  ${StyledInput}:hover & {
    opacity: 1;
  }

  & > span {
    background-color: #393e46;

    border-radius: 0.25rem;

    padding-right: 0.5rem;
    padding-left: 0.5rem;

    padding-top: 0.25rem;
    padding-bottom: 0.25rem;

    transition: all 0.25s ease-out;

    ${StyledInput}:active & {
      background-color: #61656b;
    }
  }
`;

const Input = (props) => {
  const refInput = useRef();
  const refHoverInputRange = useRef();
  const refContentInput = useRef();

  const renderInputType = (type) => {
    switch (type) {
      case "range":
        return (
          <>
            <InputRange
              type={type}
              value={props.value}
              max={props.max}
              step={props.step}
              onChange={props.onChange}
              disabled={props.disabled}
            />
            <HoverInputRange
              value={props.value}
              max={props.max}
              disabled={props.disabled}
              ref={refHoverInputRange}
            ></HoverInputRange>
            <ContentInput
              value={props.value}
              max={props.max}
              widthInput={refInput.current?.offsetWidth}
              widthHover={refHoverInputRange.current?.offsetWidth}
              widthContent={refContentInput.current?.offsetWidth}
              ref={refContentInput}
            >
              <span>{props.content}</span>
            </ContentInput>
          </>
        );

      default:
        break;
    }
  };

  return (
    <StyledInput ref={refInput} disabled={props.disabled}>
      {renderInputType(props.type)}
    </StyledInput>
  );
};

Input.propTypes = {
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf(["range"])])
    .isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Input;
