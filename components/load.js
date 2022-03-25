import React from "react";

function Button({ isLoading, children, ...props }) {
  return (
    <button className="button" {...props}>
      {isLoading ? <Loader /> : children}
    </button>
  );
}

function Example() {
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  return (
    <Button
      onClick={() => {
        setIsButtonLoading(true);
        setTimeout(() => {
          setIsButtonLoading(false);
        }, 1000);
      }}
      isLoading={isButtonLoading}
    >
      Click me
    </Button>
  );
}
