"use client";

import React, { useImperativeHandle } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import {
  createPlateEditor,
  ParagraphPlugin,
  Plate,
  PlateLeaf,
} from "@udecode/plate/react";
import { SettingsDialog } from "@/components/editor/settings";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { withProps } from "@udecode/cn";
import { serializeHtml } from "@udecode/plate";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import {
  BoldPlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { CodeLinePlugin } from "@udecode/plate-code-block/react";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { ColumnItemPlugin, ColumnPlugin } from "@udecode/plate-layout/react";
import { ColumnElement } from "@/components/plate-ui/column-element";
import { ColumnGroupElement } from "@/components/plate-ui/column-group-element";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { CommentLeaf } from "@/components/plate-ui/comment-leaf";
import { DatePlugin } from "@udecode/plate-date/react";
import { DateElement } from "@/components/plate-ui/date-element";
import { ExcalidrawPlugin } from "@udecode/plate-excalidraw/react";
import { ExcalidrawElement } from "@/components/plate-ui/excalidraw-element";
import {
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
} from "@udecode/plate-media/react";
import { MediaFileElement } from "@/components/plate-ui/media-file-element";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HighlightLeaf } from "@/components/plate-ui/highlight-leaf";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { HrElement } from "@/components/plate-ui/hr-element";
import { ImageElement } from "@/components/plate-ui/image-element";
import { InlineEquationPlugin } from "@udecode/plate-math/react";
import { InlineEquationElement } from "@/components/plate-ui/inline-equation-element";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { KbdLeaf } from "@/components/plate-ui/kbd-leaf";
import { LinkPlugin } from "@udecode/plate-link/react";
import { LinkElement } from "@/components/plate-ui/link-element";
import { MediaEmbedElement } from "@/components/plate-ui/media-embed-element";
import {
  MentionInputPlugin,
  MentionPlugin,
} from "@udecode/plate-mention/react";
import { MentionInputElement } from "@/components/plate-ui/mention-input-element";
import { MentionElement } from "@/components/plate-ui/mention-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import { MediaPlaceholderElement } from "@/components/plate-ui/media-placeholder-element";
import { SlashInputPlugin } from "@udecode/plate-slash-command/react";
import { SlashInputElement } from "@/components/plate-ui/slash-input-element";
import { TocPlugin } from "@udecode/plate-heading/react";
import { TocElement } from "@/components/plate-ui/toc-element";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { ToggleElement } from "@/components/plate-ui/toggle-element";
import { editorPlugins } from "@/components/editor/plugins/editor-plugins";
import { FixedToolbarPlugin } from "@/components/editor/plugins/fixed-toolbar-plugin";
import { FloatingToolbarPlugin } from "@/components/editor/plugins/floating-toolbar-plugin";

const siteUrl = "https://platejs.org";

export const PlateEditor = React.forwardRef(
  (props: { data: string | undefined }, ref) => {
    // TODO: editor 불러오기
    const editor = createPlateEditor({
      plugins: [...editorPlugins, FixedToolbarPlugin, FloatingToolbarPlugin],
    });

    if (props.data) {
      editor.children = editor.api.html.deserialize({
        element: props.data,
      });
    }

    const exportToHtml = async (): Promise<string> => {
      if (editor.api.isEmpty()) {
        return "";
      }

      const components = {
        [BlockquotePlugin.key]: BlockquoteElement,
        [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
        [CodeLinePlugin.key]: CodeLineElement,
        [ColumnItemPlugin.key]: ColumnElement,
        [ColumnPlugin.key]: ColumnGroupElement,
        [CommentsPlugin.key]: CommentLeaf,
        [DatePlugin.key]: DateElement,
        [ExcalidrawPlugin.key]: ExcalidrawElement,
        [FilePlugin.key]: MediaFileElement,
        [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
        [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
        [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
        [HEADING_KEYS.h4]: withProps(HeadingElement, { variant: "h4" }),
        [HEADING_KEYS.h5]: withProps(HeadingElement, { variant: "h5" }),
        [HEADING_KEYS.h6]: withProps(HeadingElement, { variant: "h6" }),
        [HighlightPlugin.key]: HighlightLeaf,
        [HorizontalRulePlugin.key]: HrElement,
        [ImagePlugin.key]: ImageElement,
        [InlineEquationPlugin.key]: InlineEquationElement,
        [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
        [KbdPlugin.key]: KbdLeaf,
        [LinkPlugin.key]: LinkElement,
        [MediaEmbedPlugin.key]: MediaEmbedElement,
        [MentionInputPlugin.key]: MentionInputElement,
        [MentionPlugin.key]: MentionElement,
        [ParagraphPlugin.key]: ParagraphElement,
        [PlaceholderPlugin.key]: MediaPlaceholderElement,
        [SlashInputPlugin.key]: SlashInputElement,
        [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
        [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
        [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
        [TocPlugin.key]: TocElement,
        [TogglePlugin.key]: ToggleElement,
        [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
      };

      return await serializeHtml(editor, {
        components,
        props: { style: { padding: "0 calc(50% - 350px)", paddingBottom: "" } },
      });
    };

    useImperativeHandle(ref, () => ({
      exportToHtml,
    }));

    return (
      <div>
        <DndProvider backend={HTML5Backend}>
          <Plate editor={editor}>
            <EditorContainer>
              <Editor />
            </EditorContainer>

            <SettingsDialog />
          </Plate>
        </DndProvider>
      </div>
    );
  },
);
