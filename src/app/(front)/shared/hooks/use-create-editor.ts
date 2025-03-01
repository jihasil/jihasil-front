import { editorPlugins } from "@/app/(front)/components/editor/plugins/editor-plugins";
import { FixedToolbarPlugin } from "@/app/(front)/components/editor/plugins/fixed-toolbar-plugin";
import { FloatingToolbarPlugin } from "@/app/(front)/components/editor/plugins/floating-toolbar-plugin";
import { BlockquoteElement } from "@/app/(front)/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/app/(front)/components/plate-ui/code-block-element";
import { CodeLeaf } from "@/app/(front)/components/plate-ui/code-leaf";
import { CodeLineElement } from "@/app/(front)/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/app/(front)/components/plate-ui/code-syntax-leaf";
import { ColumnElement } from "@/app/(front)/components/plate-ui/column-element";
import { ColumnGroupElement } from "@/app/(front)/components/plate-ui/column-group-element";
import { CommentLeaf } from "@/app/(front)/components/plate-ui/comment-leaf";
import { DateElement } from "@/app/(front)/components/plate-ui/date-element";
import { EmojiInputElement } from "@/app/(front)/components/plate-ui/emoji-input-element";
import { EquationElement } from "@/app/(front)/components/plate-ui/equation-element";
import { ExcalidrawElement } from "@/app/(front)/components/plate-ui/excalidraw-element";
import { HeadingElement } from "@/app/(front)/components/plate-ui/heading-element";
import { HighlightLeaf } from "@/app/(front)/components/plate-ui/highlight-leaf";
import { HrElement } from "@/app/(front)/components/plate-ui/hr-element";
import { ImageElement } from "@/app/(front)/components/plate-ui/image-element";
import { InlineEquationElement } from "@/app/(front)/components/plate-ui/inline-equation-element";
import { KbdLeaf } from "@/app/(front)/components/plate-ui/kbd-leaf";
import { LinkElement } from "@/app/(front)/components/plate-ui/link-element";
import { MediaAudioElement } from "@/app/(front)/components/plate-ui/media-audio-element";
import { MediaEmbedElement } from "@/app/(front)/components/plate-ui/media-embed-element";
import { MediaFileElement } from "@/app/(front)/components/plate-ui/media-file-element";
import { MediaPlaceholderElement } from "@/app/(front)/components/plate-ui/media-placeholder-element";
import { MediaVideoElement } from "@/app/(front)/components/plate-ui/media-video-element";
import { MentionElement } from "@/app/(front)/components/plate-ui/mention-element";
import { MentionInputElement } from "@/app/(front)/components/plate-ui/mention-input-element";
import { ParagraphElement } from "@/app/(front)/components/plate-ui/paragraph-element";
import { withPlaceholders } from "@/app/(front)/components/plate-ui/placeholder";
import { SlashInputElement } from "@/app/(front)/components/plate-ui/slash-input-element";
import { TableRowElement } from "@/app/(front)/components/plate-ui/table-row-element";
import { TocElement } from "@/app/(front)/components/plate-ui/toc-element";
import { ToggleElement } from "@/app/(front)/components/plate-ui/toggle-element";
import { withProps } from "@udecode/cn";
import {
  ParagraphPlugin,
  PlateLeaf,
  usePlateEditor,
} from "@udecode/plate/react";
import { AIPlugin } from "@udecode/plate-ai/react";
import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { CommentsPlugin } from "@udecode/plate-comments/react";
import { DatePlugin } from "@udecode/plate-date/react";
import { EmojiInputPlugin } from "@udecode/plate-emoji/react";
import { ExcalidrawPlugin } from "@udecode/plate-excalidraw/react";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { TocPlugin } from "@udecode/plate-heading/react";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { ColumnItemPlugin, ColumnPlugin } from "@udecode/plate-layout/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import {
  EquationPlugin,
  InlineEquationPlugin,
} from "@udecode/plate-math/react";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  PlaceholderPlugin,
  VideoPlugin,
} from "@udecode/plate-media/react";
import {
  MentionInputPlugin,
  MentionPlugin,
} from "@udecode/plate-mention/react";
import { SlashInputPlugin } from "@udecode/plate-slash-command/react";
import {
  TableCellHeaderPlugin,
  TableCellPlugin,
  TablePlugin,
  TableRowPlugin,
} from "@udecode/plate-table/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";

import {
  TableCellElement,
  TableCellHeaderElement,
} from "../../components/plate-ui/table-cell-element";
import { TableElement } from "../../components/plate-ui/table-element";

export const useCreateEditor = (
  p0: unknown,
  deps: any[],
  value: string | undefined,
) => {
  return usePlateEditor({
    override: {
      components: withPlaceholders(components),
    },
    plugins: [
      // ...copilotPlugins,
      ...editorPlugins,
      FixedToolbarPlugin,
      FloatingToolbarPlugin,
    ],
    value: value,
  });
};

export const components = {
  // [AIPlugin.key]: AILeaf,
  [AudioPlugin.key]: MediaAudioElement,
  [BlockquotePlugin.key]: BlockquoteElement,
  [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
  [CodeBlockPlugin.key]: CodeBlockElement,
  [CodeLinePlugin.key]: CodeLineElement,
  [CodePlugin.key]: CodeLeaf,
  [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
  [ColumnItemPlugin.key]: ColumnElement,
  [ColumnPlugin.key]: ColumnGroupElement,
  [CommentsPlugin.key]: CommentLeaf,
  [DatePlugin.key]: DateElement,
  [EmojiInputPlugin.key]: EmojiInputElement,
  [EquationPlugin.key]: EquationElement,
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
  [TableCellHeaderPlugin.key]: TableCellHeaderElement,
  [TableCellPlugin.key]: TableCellElement,
  [TablePlugin.key]: TableElement,
  [TableRowPlugin.key]: TableRowElement,
  [TocPlugin.key]: TocElement,
  [TogglePlugin.key]: ToggleElement,
  [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
  [VideoPlugin.key]: MediaVideoElement,
};
