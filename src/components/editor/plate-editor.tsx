"use client";

import React, { useEffect, useImperativeHandle, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { SettingsDialog } from "@/components/editor/settings";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import {
  BaseAudioPlugin,
  BaseFilePlugin,
  BaseImagePlugin,
  BaseMediaEmbedPlugin,
  BaseVideoPlugin,
} from "@udecode/plate-media";
import { MediaAudioElementStatic } from "@/components/plate-ui/media-audio-element-static";
import { BaseBlockquotePlugin } from "@udecode/plate-block-quote";
import { BlockquoteElementStatic } from "@/components/plate-ui/blockquote-element-static";
import {
  BaseBoldPlugin,
  BaseCodePlugin,
  BaseItalicPlugin,
  BaseStrikethroughPlugin,
  BaseSubscriptPlugin,
  BaseSuperscriptPlugin,
  BaseUnderlinePlugin,
} from "@udecode/plate-basic-marks";
import { withProps } from "@udecode/cn";
import {
  BaseParagraphPlugin,
  createSlateEditor,
  serializeHtml,
  SlateLeaf,
} from "@udecode/plate";
import {
  BaseCodeBlockPlugin,
  BaseCodeLinePlugin,
  BaseCodeSyntaxPlugin,
} from "@udecode/plate-code-block";
import { CodeBlockElementStatic } from "@/components/plate-ui/code-block-element-static";
import { CodeLineElementStatic } from "@/components/plate-ui/code-line-element-static";
import { CodeLeafStatic } from "@/components/plate-ui/code-leaf-static";
import { CodeSyntaxLeafStatic } from "@/components/plate-ui/code-syntax-leaf-static";
import { BaseColumnItemPlugin, BaseColumnPlugin } from "@udecode/plate-layout";
import { ColumnElementStatic } from "@/components/plate-ui/column-element-static";
import { ColumnGroupElementStatic } from "@/components/plate-ui/column-group-element-static";
import { BaseCommentsPlugin } from "@udecode/plate-comments";
import { CommentLeafStatic } from "@/components/plate-ui/comment-leaf-static";
import { BaseDatePlugin } from "@udecode/plate-date";
import { DateElementStatic } from "@/components/plate-ui/date-element-static";
import {
  BaseEquationPlugin,
  BaseInlineEquationPlugin,
} from "@udecode/plate-math";
import { EquationElementStatic } from "@/components/plate-ui/equation-element-static";
import { MediaFileElementStatic } from "@/components/plate-ui/media-file-element-static";
import { BaseHighlightPlugin } from "@udecode/plate-highlight";
import { HighlightLeafStatic } from "@/components/plate-ui/highlight-leaf-static";
import { BaseHorizontalRulePlugin } from "@udecode/plate-horizontal-rule";
import { HrElementStatic } from "@/components/plate-ui/hr-element-static";
import { ImageElementStatic } from "@/components/plate-ui/image-element-static";
import { InlineEquationElementStatic } from "@/components/plate-ui/inline-equation-element-static";
import { BaseKbdPlugin } from "@udecode/plate-kbd";
import { KbdLeafStatic } from "@/components/plate-ui/kbd-leaf-static";
import { BaseLinkPlugin } from "@udecode/plate-link";
import { LinkElementStatic } from "@/components/plate-ui/link-element-static";
import { BaseMentionPlugin } from "@udecode/plate-mention";
import { MentionElementStatic } from "@/components/plate-ui/mention-element-static";
import { ParagraphElementStatic } from "@/components/plate-ui/paragraph-element-static";
import {
  BaseTableCellHeaderPlugin,
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
} from "@udecode/plate-table";
import {
  TableCellElementStatic,
  TableCellHeaderStaticElement,
} from "@/components/plate-ui/table-cell-element-static";
import { TableElementStatic } from "@/components/plate-ui/table-element-static";
import { TableRowElementStatic } from "@/components/plate-ui/table-row-element-static";
import {
  BaseHeadingPlugin,
  BaseTocPlugin,
  HEADING_KEYS,
  HEADING_LEVELS,
} from "@udecode/plate-heading";
import { TocElementStatic } from "@/components/plate-ui/toc-element-static";
import { BaseTogglePlugin } from "@udecode/plate-toggle";
import { ToggleElementStatic } from "@/components/plate-ui/toggle-element-static";
import { MediaVideoElementStatic } from "@/components/plate-ui/media-video-element-static";
import { HeadingElementStatic } from "@/components/plate-ui/heading-element-static";
import { BaseIndentPlugin } from "@udecode/plate-indent";
import { BaseIndentListPlugin } from "@udecode/plate-indent-list";
import {
  FireLiComponent,
  FireMarker,
} from "@/components/plate-ui/indent-fire-marker";
import {
  TodoLiStatic,
  TodoMarkerStatic,
} from "@/components/plate-ui/indent-todo-marker-static";
import {
  BaseFontBackgroundColorPlugin,
  BaseFontColorPlugin,
  BaseFontSizePlugin,
} from "@udecode/plate-font";
import { BaseAlignPlugin } from "@udecode/plate-alignment";
import { BaseLineHeightPlugin } from "@udecode/plate-line-height";
import { EditorStatic } from "@/components/plate-ui/editor-static";

// @ts-expect-error 오류 안 남
import Prism from "prismjs";

export const PlateEditor = React.forwardRef(
  (props: { data: string | undefined }, ref) => {
    // TODO: editor 불러오기
    const editor = useCreateEditor();

    if (props.data) {
      // @ts-expect-error 오류 안 남
      editor.children = editor.api.html.deserialize({
        element: props.data,
      });
    }

    const exportToHtml = async (): Promise<string> => {
      if (editor.api.isEmpty()) {
        return "";
      }

      const components = {
        [BaseAudioPlugin.key]: MediaAudioElementStatic,
        [BaseBlockquotePlugin.key]: BlockquoteElementStatic,
        [BaseBoldPlugin.key]: withProps(SlateLeaf, { as: "strong" }),
        [BaseCodeBlockPlugin.key]: CodeBlockElementStatic,
        [BaseCodeLinePlugin.key]: CodeLineElementStatic,
        [BaseCodePlugin.key]: CodeLeafStatic,
        [BaseCodeSyntaxPlugin.key]: CodeSyntaxLeafStatic,
        [BaseColumnItemPlugin.key]: ColumnElementStatic,
        [BaseColumnPlugin.key]: ColumnGroupElementStatic,
        [BaseCommentsPlugin.key]: CommentLeafStatic,
        [BaseDatePlugin.key]: DateElementStatic,
        [BaseEquationPlugin.key]: EquationElementStatic,
        [BaseFilePlugin.key]: MediaFileElementStatic,
        [BaseHighlightPlugin.key]: HighlightLeafStatic,
        [BaseHorizontalRulePlugin.key]: HrElementStatic,
        [BaseImagePlugin.key]: ImageElementStatic,
        [BaseInlineEquationPlugin.key]: InlineEquationElementStatic,
        [BaseItalicPlugin.key]: withProps(SlateLeaf, { as: "em" }),
        [BaseKbdPlugin.key]: KbdLeafStatic,
        [BaseLinkPlugin.key]: LinkElementStatic,
        // [BaseMediaEmbedPlugin.key]: MediaEmbedElementStatic,
        [BaseMentionPlugin.key]: MentionElementStatic,
        [BaseParagraphPlugin.key]: ParagraphElementStatic,
        [BaseStrikethroughPlugin.key]: withProps(SlateLeaf, { as: "del" }),
        [BaseSubscriptPlugin.key]: withProps(SlateLeaf, { as: "sub" }),
        [BaseSuperscriptPlugin.key]: withProps(SlateLeaf, { as: "sup" }),
        [BaseTableCellHeaderPlugin.key]: TableCellHeaderStaticElement,
        [BaseTableCellPlugin.key]: TableCellElementStatic,
        [BaseTablePlugin.key]: TableElementStatic,
        [BaseTableRowPlugin.key]: TableRowElementStatic,
        [BaseTocPlugin.key]: TocElementStatic,
        [BaseTogglePlugin.key]: ToggleElementStatic,
        [BaseUnderlinePlugin.key]: withProps(SlateLeaf, { as: "u" }),
        [BaseVideoPlugin.key]: MediaVideoElementStatic,
        [HEADING_KEYS.h1]: withProps(HeadingElementStatic, { variant: "h1" }),
        [HEADING_KEYS.h2]: withProps(HeadingElementStatic, { variant: "h2" }),
        [HEADING_KEYS.h3]: withProps(HeadingElementStatic, { variant: "h3" }),
        [HEADING_KEYS.h4]: withProps(HeadingElementStatic, { variant: "h4" }),
        [HEADING_KEYS.h5]: withProps(HeadingElementStatic, { variant: "h5" }),
        [HEADING_KEYS.h6]: withProps(HeadingElementStatic, { variant: "h6" }),
      };

      const editorStatic = createSlateEditor({
        plugins: [
          BaseColumnPlugin,
          BaseColumnItemPlugin,
          BaseTocPlugin,
          BaseVideoPlugin,
          BaseAudioPlugin,
          BaseParagraphPlugin,
          BaseHeadingPlugin,
          BaseMediaEmbedPlugin,
          BaseBoldPlugin,
          BaseCodePlugin,
          BaseItalicPlugin,
          BaseStrikethroughPlugin,
          BaseSubscriptPlugin,
          BaseSuperscriptPlugin,
          BaseUnderlinePlugin,
          BaseBlockquotePlugin,
          BaseDatePlugin,
          BaseEquationPlugin,
          BaseInlineEquationPlugin,
          BaseCodeBlockPlugin.configure({
            options: {
              prism: Prism,
            },
          }),
          BaseIndentPlugin.extend({
            inject: {
              targetPlugins: [
                BaseParagraphPlugin.key,
                BaseBlockquotePlugin.key,
                BaseCodeBlockPlugin.key,
              ],
            },
          }),
          BaseIndentListPlugin.extend({
            inject: {
              targetPlugins: [
                BaseParagraphPlugin.key,
                ...HEADING_LEVELS,
                BaseBlockquotePlugin.key,
                BaseCodeBlockPlugin.key,
                BaseTogglePlugin.key,
              ],
            },
            options: {
              listStyleTypes: {
                fire: {
                  liComponent: FireLiComponent,
                  markerComponent: FireMarker,
                  type: "fire",
                },
                todo: {
                  liComponent: TodoLiStatic,
                  markerComponent: TodoMarkerStatic,
                  type: "todo",
                },
              },
            },
          }),
          BaseLinkPlugin,
          BaseTableRowPlugin,
          BaseTablePlugin,
          BaseTableCellPlugin,
          BaseHorizontalRulePlugin,
          BaseFontColorPlugin,
          BaseFontBackgroundColorPlugin,
          BaseFontSizePlugin,
          BaseKbdPlugin,
          BaseAlignPlugin.extend({
            inject: {
              targetPlugins: [
                BaseParagraphPlugin.key,
                BaseMediaEmbedPlugin.key,
                ...HEADING_LEVELS,
                BaseImagePlugin.key,
              ],
            },
          }),
          BaseLineHeightPlugin,
          BaseHighlightPlugin,
          BaseFilePlugin,
          BaseImagePlugin,
          BaseMentionPlugin,
          BaseCommentsPlugin,
          BaseTogglePlugin,
        ],
        value: editor.children,
      });

      return await serializeHtml(editorStatic, {
        components,
        editorComponent: EditorStatic,
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
