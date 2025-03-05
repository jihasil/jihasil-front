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
import React, { useImperativeHandle } from "react";

export const PlateEditor = React.forwardRef(
  (
    props: {
      html: string | undefined;
      // onChange: (html: string) => void;
    },
    ref,
  ) => {
    const editor = useCreateEditor(props.html);
    const editorStatic = createSlateEditor({
      plugins: plateStaticPlugins,
    });

    const getHtml = async () => {
      if (editor.api.isEmpty()) {
        return null;
      }
      editorStatic.children = editor.children;
      const html = await serializeHtml(editorStatic, {
        components: plateStaticComponents,
        props: {
          style: {
            padding: "0 calc(50% - 350px)",
            paddingBottom: "",
          },
        },
      });
      console.log(html);
      return html;
    };

    useImperativeHandle(ref, () => ({
      getHtml,
    }));

    return (
      <DndProvider backend={HTML5Backend}>
        <Plate editor={editor}>
          <EditorContainer>
            <Editor />
          </EditorContainer>
        </Plate>
      </DndProvider>
    );
  },
);
