import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  plateStaticComponents,
  plateStaticPlugins,
} from "@/app/(front)/components/editor/PlateStaticComponents";
import {
  Editor,
  EditorContainer,
} from "@/app/(front)/components/plate-ui/editor";
import { createSlateEditor, serializeHtml } from "@udecode/plate";
import { Plate } from "@udecode/plate-core/react";

import { useCreateEditor } from "@/app/(front)/shared/hooks/use-create-editor";

export const PlateEditor = (props: {
  html: string | undefined;
  onChange: (html: string) => void;
}) => {
  const editor = useCreateEditor(props.html);
  const editorStatic = createSlateEditor({
    plugins: plateStaticPlugins,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={async ({ value }) => {
          // console.log(value);
          editorStatic.children = value;

          if (editor.api.isEmpty()) {
            props.onChange("");
          } else {
            const serializedHtml = await serializeHtml(editorStatic, {
              components: plateStaticComponents,
              props: {
                style: {
                  padding: "0 calc(50% - 350px)",
                  paddingBottom: "",
                },
              },
            });

            // console.log(serializedHtml);

            props.onChange(serializedHtml);
          }
        }}
      >
        <EditorContainer>
          <Editor />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
};
